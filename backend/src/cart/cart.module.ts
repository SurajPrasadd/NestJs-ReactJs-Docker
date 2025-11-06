import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { BusinessProduct } from '../products/businessproduct.entity';
import { Contract } from '../contracts/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, BusinessProduct, Contract])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
