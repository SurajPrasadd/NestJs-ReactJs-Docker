import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../business/business.entity';
import { Product } from '../products/products.entity';
import { BusinessProduct } from './businessproduct.entity';
import { CreateBusinessProductDto } from './dto/create-business-product.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessProductsService {
  constructor(
    @InjectRepository(BusinessProduct)
    private readonly businessProductRepo: Repository<BusinessProduct>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly config: ConfigService,
  ) {}

  // ✅ Create
  async create(dto: CreateBusinessProductDto) {
    const {
      businessId,
      productId,
      price,
      currency,
      minQuantity,
      groupName,
      isActive,
    } = dto;

    const business = await this.businessRepo.findOneBy({ id: businessId });
    if (!business) throw new NotFoundException('Business not found');

    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

    const exists = await this.businessProductRepo.findOne({
      where: { business: { id: businessId }, product: { id: productId } },
    });
    if (exists)
      throw new ConflictException(
        'This product already exists for the business',
      );

    const businessProduct = this.businessProductRepo.create({
      business,
      product,
      price,
      currency,
      minQuantity,
      groupName,
      isActive,
    });
    this.businessProductRepo.save(businessProduct);
    return null;
  }

  // ✅ Update
  async update(id: number, dto: CreateBusinessProductDto) {
    const businessProduct = await this.findOne(id);

    if (dto.price !== undefined) businessProduct.price = dto.price;
    if (dto.currency !== undefined) businessProduct.currency = dto.currency;
    if (dto.minQuantity !== undefined)
      businessProduct.minQuantity = dto.minQuantity;
    if (dto.isActive !== undefined) businessProduct.isActive = dto.isActive;
    if (dto.groupName !== undefined) businessProduct.groupName = dto.groupName;

    this.businessProductRepo.save(businessProduct);
    return null;
  }

  // ✅ Delete
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.businessProductRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Business product not found');
    return { message: 'Deleted successfully' };
  }

  // ✅ Get one
  async findOne(id: number): Promise<BusinessProduct> {
    const record = await this.businessProductRepo.findOne({
      where: { id },
      relations: ['business', 'product', 'product.images'],
    });

    // ✅ Type narrowing
    if (!record) {
      throw new NotFoundException('Business product not found');
    }

    return record;
  }

  // ✅ Get all
  // ✅ Enhanced Get All (with search, pagination, filters, sorting)
  async findAll(queryDto: {
    search?: string;
    page?: number;
    limit?: number;
    businessId?: number;
    productId?: number;
    isActive?: boolean;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<any> {
    const {
      search,
      page = 1,
      limit = 10,
      businessId,
      productId,
      isActive,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryDto;

    const query = this.businessProductRepo
      .createQueryBuilder('bp')
      .leftJoinAndSelect('bp.product', 'product')
      .leftJoinAndSelect('product.images', 'images');

    // 🔍 Search by product name, SKU, or business name
    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.andWhere('images.isPrimary = true');

    // 🏢 Filter by business
    query.andWhere('bp.business_id = :businessId', { businessId });

    // 📦 Filter by product
    if (productId) query.andWhere('product.id = :productId', { productId });

    // ✅ Filter by isActive
    if (typeof isActive === 'boolean')
      query.andWhere('bp.isActive = :isActive', { isActive });

    // 📑 Pagination
    query.skip((page - 1) * limit).take(limit);

    // 🔽 Sorting (validate allowed fields)
    const validSortFields = ['price', 'minQuantity', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`bp.${sortField}`, order);

    // 📦 Execute query
    const [records, total] = await query.getManyAndCount();

    return {
      records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortBy: sortField,
      order,
    };
  }
}
