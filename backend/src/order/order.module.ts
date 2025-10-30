import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistory } from './order-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory])],
  controllers: [],
  providers: [],
})
export class OrderModule {}
