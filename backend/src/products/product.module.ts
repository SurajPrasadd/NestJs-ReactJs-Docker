import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Product } from './products.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoriesService } from './categories.service';
import { Business } from '../business/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Business])],
  controllers: [ProductController],
  providers: [CategoriesService, ProductService],
})
export class ProductModule {}
