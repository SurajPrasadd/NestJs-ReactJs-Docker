import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business.entity';
import { Stock } from './stock.entity';
import { Contact } from './contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Stock, Contact])],
  controllers: [],
  providers: [],
})
export class BusinessModule {}
