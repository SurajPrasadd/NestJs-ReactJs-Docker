import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateUpdateDto } from './dto/create-update.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateUpdateDto): Promise<Category> {
    // Check if category name already exists
    const existing = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      isActive: dto.isActive ?? false,
    });

    if (dto.parentId) {
      const parent = await this.findOne(dto.parentId);
      if (!parent) throw new NotFoundException('Parent category not found');
      category.parent = parent;
    }

    return this.categoryRepo.save(category);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
  }

  async update(id: number, dto: CreateUpdateDto): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');

    if (dto.name) {
      category.name = dto.name;
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        category.parent = null;
      } else {
        const parent = await this.findOne(dto.parentId);
        if (!parent) throw new NotFoundException('Parent category not found');
        category.parent = parent;
      }
    }

    category.isActive = dto.isActive ?? false;

    return this.categoryRepo.save(category);
  }

  async getAllCategories(): Promise<Category[]> {
    // Step 1: Fetch all categories with parent and children
    const query = this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children')
      .orderBy('category.name', 'ASC')
      .addOrderBy('children.name', 'ASC')
      .where('category.parent IS NULL');

    // Step 2: Return only top-level (parent) categories
    return query.getMany();
  }

  async getCategories(
    queryDto: QueryCategoryDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { search, page, limit } = queryDto;

    //Featch All
    const query = this.categoryRepo
      .createQueryBuilder('category')
      .orderBy('category.name', 'ASC');

    //Only Child inside Parent category
    // const query = this.categoryRepo
    //   .createQueryBuilder('category')
    //   .leftJoinAndSelect('category.children', 'children')
    //   .orderBy('category.name', 'ASC')
    //   .addOrderBy('children.name', 'ASC')
    //   .where('category.parent IS NULL');

    //Only Child category
    // const query = this.categoryRepo
    //   .createQueryBuilder('category')
    //   .where('category.parent IS NOT NULL');

    //Only Parent category
    // const query = this.categoryRepo
    //   .createQueryBuilder('category')
    //   .where('category.parent IS NULL');

    // 🔍 Search filter
    if (search) {
      query.andWhere('LOWER(category.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    // 🧭 Default sorting
    query.orderBy('category.name', 'ASC');

    // 📄 Pagination
    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }
}
