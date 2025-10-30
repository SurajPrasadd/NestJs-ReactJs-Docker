import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Catalog } from './catalogs.entity';
import { Product } from './products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Catalog, Product])],
  controllers: [],
  providers: [],
})
export class ProductModule {}
