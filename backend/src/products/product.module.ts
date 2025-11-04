import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Business } from '../business/business.entity';
import { BusinessProduct } from './businessproduct.entity';
import { ProductImage } from './product-image.entity';
import { Category } from '../categories/category.entity';
import { BusinessProductsController } from './business-products.controller';
import { BusinessProductsService } from './business-products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Business,
      BusinessProduct,
      ProductImage,
    ]),
  ],
  controllers: [ProductController, BusinessProductsController],
  providers: [ProductService, BusinessProductsService],
})
export class ProductModule {}
