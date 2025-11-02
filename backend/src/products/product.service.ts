import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from './category.entity';
import { Business } from '../business/business.entity';
import { Product } from './products.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
    private readonly config: ConfigService,
  ) {}

  async createProduct(
    dto: CreateProductDto,
    imagePath?: string,
  ): Promise<Product> {
    const business = await this.businessRepo.findOneBy({ id: dto.businessId });
    if (!business) throw new Error('Business not found');

    let category: Category | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    }

    // Step 1: Create product without SKU
    let product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      currency: dto.currency || 'Rs',
      minQuantity: dto.minQuantity || 1,
      isActive: dto.isActive ?? true,
      business,
      category,
      productImage: imagePath || null,
      sku: 'TEMP',
    } as Partial<Product>);

    product = await this.productRepo.save(product);

    // Step 2: Generate final SKU and save again
    product.sku = `CA${product.id}`;
    product = await this.productRepo.save(product);

    // ✅ Step 3: Prepend backend URL to productImage if present
    const backendUrl = this.config.get<string>('BACKEND_URL', '');
    if (product.productImage) {
      product.productImage = backendUrl + product.productImage;
    }

    return product;
  }

  async updateProductBySku(
    sku: string,
    dto: Partial<CreateProductDto>,
    imagePath?: string | null,
  ): Promise<Product> {
    // Find product
    const product = await this.productRepo.findOne({
      where: { sku },
      relations: ['business', 'category'],
    });

    if (!product) throw new Error('Product not found');

    // ✅ Update only non-null fields
    const updatableFields = [
      'name',
      'description',
      'price',
      'currency',
      'minQuantity',
      'isActive',
    ] as const;

    for (const field of updatableFields) {
      if (dto[field] !== null && dto[field] !== undefined) {
        (product as any)[field] = dto[field];
      }
    }

    // ✅ Update relations if needed
    if (dto.businessId) {
      const business = await this.businessRepo.findOneBy({
        id: dto.businessId,
      });
      if (!business) throw new Error('Business not found');
      product.business = business;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: dto.categoryId,
      });
      product.category = category || null;
    }

    // ✅ Handle image replacement
    if (imagePath) {
      // Delete old image if exists
      if (product.productImage) {
        const oldImagePath = path.join(process.cwd(), product.productImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      product.productImage = imagePath;
    }

    const updated = await this.productRepo.save(product);

    // ✅ Prepend backend URL to image path for response
    const backendUrl = this.config.get<string>('BACKEND_URL', '');
    if (updated.productImage) {
      updated.productImage = backendUrl + updated.productImage;
    }

    return updated;
  }

  async deleteProductBySku(sku: string) {
    // Find product
    const product = await this.productRepo.findOne({ where: { sku } });

    if (!product) throw new Error('Product not found');

    if (product.productImage) {
      const oldImagePath = path.join(process.cwd(), product.productImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await this.productRepo.delete({ sku });

    return null;
  }

  async getProducts(queryDto: QueryProductDto) {
    const {
      search,
      page = 1,
      limit = 10,
      categoryId,
      businessId,
      isActive,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryDto;

    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.business', 'business');

    // 🔍 Search
    if (search) {
      query.andWhere(
        '(product.name LIKE :search OR product.sku LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 📁 Filters
    if (categoryId) query.andWhere('category.id = :categoryId', { categoryId });
    if (businessId) query.andWhere('business.id = :businessId', { businessId });
    if (typeof isActive === 'boolean')
      query.andWhere('product.isActive = :isActive', { isActive });

    // 🧾 Pagination
    query.skip((page - 1) * limit).take(limit);

    // 🔽 Sorting
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`product.${sortField}`, order);

    // 📦 Fetch data
    const [products, total] = await query.getManyAndCount();

    // 🌐 Add image URLs efficiently
    const backendUrl = this.config.get<string>('BACKEND_URL', '');
    const data = products.map((p) => ({
      ...p,
      productImage: p.productImage ? `${backendUrl}${p.productImage}` : null,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortBy: sortField,
      order,
    };
  }
}
