import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../categories/category.entity';
import { Business } from '../business/business.entity';
import { Product } from './products.entity';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { QueryProductDto } from './dto/query-product.dto';
import { BusinessProduct } from './businessproduct.entity';
import { ProductImage } from './product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
    @InjectRepository(BusinessProduct)
    private businessProRepo: Repository<BusinessProduct>,
    @InjectRepository(ProductImage)
    private proImageRepo: Repository<ProductImage>,
    private readonly config: ConfigService,
  ) {}

  async createProduct(dto: CreateProductDto, imagePaths: string[]) {
    const {
      businessId,
      categoryId,
      name,
      description,
      price,
      currency,
      minQuantity,
      isActive,
      isPriceAva,
    } = dto;

    const productCheck = await this.productRepo.findOneBy({ name: name });
    if (productCheck) throw new Error('Product name already exists.');

    let category: Category | null = null;
    let sku = `SKU-${Date.now()}`;
    let business: Business | null = null;
    if (isPriceAva) {
      business = await this.businessRepo.findOneBy({ id: businessId });
      if (!business) throw new Error('Business not found');
    }

    if (categoryId) {
      category = await this.categoryRepo.findOneBy({ id: categoryId });
    }
    // Step 1: Create product
    const product = this.productRepo.create({
      name,
      description,
      category,
      sku: sku,
      isActive: isActive ?? true,
    });
    const savedProduct = await this.productRepo.save(product);

    // Step 2: Add images
    if (imagePaths.length > 0) {
      const productImages = imagePaths.map((url, index) =>
        this.proImageRepo.create({
          product: savedProduct,
          imageUrl: url,
          isPrimary: index === 0,
        }),
      );
      await this.proImageRepo.save(productImages);
    }

    if (isPriceAva) {
      // Step 3: Link product to business
      const businessProduct = this.businessProRepo.create({
        business,
        product: savedProduct,
        price,
        currency: currency || 'INR',
        minQuantity: minQuantity || 1,
        isActive: isActive ?? true,
      });

      await this.businessProRepo.save(businessProduct);
    }

    return `${sku} is created successfully`;
  }

  async updateProductBySku(
    id: number,
    dto: Partial<CreateProductDto>,
    imagePaths: string[],
  ) {
    // ✅ 1. Find product with relations
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!product) throw new Error('Product not found');

    // ✅ 2. Update basic fields
    const updatableFields = ['name', 'description', 'isActive'] as const;

    for (const field of updatableFields) {
      if (dto[field] !== null && dto[field] !== undefined) {
        (product as any)[field] = dto[field];
      }
    }

    // ✅ 3. Update category if provided
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: dto.categoryId,
      });
      product.category = category || null;
    }

    // ✅ 5. Handle multiple image replacement (if new images uploaded)
    if (imagePaths && imagePaths.length > 0) {
      // delete old images from disk + DB
      for (const oldImage of product.images || []) {
        try {
          const oldPath = path.join(process.cwd(), oldImage.imageUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn(`Failed to delete ${oldImage.imageUrl}:`, err);
        }
      }
      await this.proImageRepo.delete({ product: { id: product.id } });

      // save new images
      const newImages = imagePaths.map((url, index) =>
        this.proImageRepo.create({
          product,
          imageUrl: url,
          isPrimary: index === 0,
        }),
      );
      const savedImages = await this.proImageRepo.save(newImages);

      // ✅ update relation manually
      product.images = savedImages;
    }

    // ✅ 6. Save updated product
    await this.productRepo.save(product);
    return `${id} is updated successfully`;
  }

  async deleteProductBySku(id: number): Promise<{ message: string }> {
    // ✅ 1. Find product with relations
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) throw new Error('Product not found');

    if (product.images && product.images.length > 0) {
      // delete old images from disk + DB
      for (const oldImage of product.images || []) {
        try {
          const oldPath = path.join(process.cwd(), oldImage.imageUrl);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn(`Failed to delete ${oldImage.imageUrl}:`, err);
        }
      }
      // ✅ 3. Delete all product images from DB
      await this.proImageRepo.delete({ product: { id: product.id } });
    }
    // ✅ 4. Delete the product itself
    await this.productRepo.delete({ id: product.id });

    return {
      message: `Product with ${id} and all related images deleted successfully`,
    };
  }

  async getProducts(queryDto: QueryProductDto, userId: number) {
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
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.businessProducts', 'businessProducts')
      .leftJoinAndSelect('businessProducts.business', 'business')
      .leftJoinAndMapOne(
        'businessProducts.cartItem',
        'businessProducts.cartItems',
        'cartItem',
        'cartItem.users_id = :userId',
        { userId },
      ); // ✅ correct relation path

    // 🔍 Search by name, SKU, or description
    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.andWhere('images.isPrimary = true');

    // 📁 Filter by category or business
    if (categoryId)
      query.andWhere('product.category_id = :categoryId', { categoryId });
    if (businessId) query.andWhere('business.id = :businessId', { businessId });
    if (typeof isActive === 'boolean')
      query.andWhere('product.isActive = :isActive', { isActive });

    // 🧾 Pagination
    query.skip((page - 1) * limit).take(limit);

    // 🔽 Sorting (validate sort field)
    const validSortFields = ['name', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`product.${sortField}`, order);

    // 💰 Also order by business product price (hybrid safe approach)
    query.addOrderBy('businessProducts.price', 'ASC');

    // 📦 Execute query
    const [products, total] = await query.getManyAndCount();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortBy: sortField,
      order,
    };
  }

  async findOne(id: number, userId: number): Promise<Product> {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.businessProducts', 'businessProducts')
      .leftJoinAndSelect('businessProducts.business', 'business')
      .leftJoinAndMapOne(
        'businessProducts.cartItem',
        'businessProducts.cartItems',
        'cartItem',
        'cartItem.users_id = :userId',
        { userId },
      )
      .where('product.id = :id', { id });

    query.addOrderBy('businessProducts.price', 'ASC');

    const record = await query.getOne();

    // ✅ Handle not found
    if (!record) {
      throw new NotFoundException('Product not found');
    }
    return record;
  }
}
