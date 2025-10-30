import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Stock } from './stock.entity';
import { Contact } from './contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Stock, Contact])],
  controllers: [],
  providers: [],
})
export class SupplierModule {}
