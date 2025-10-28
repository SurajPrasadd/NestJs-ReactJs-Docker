import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Contract } from './contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier,Contract])],
  controllers: [],
  providers: [],
})
export class SupplierModule {}
