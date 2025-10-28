import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Catalog } from './catalogs.entity';
import { Pricing } from './pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Catalog,Pricing])],
  controllers: [],
  providers: [],
})
export class CatalogsModule {}
