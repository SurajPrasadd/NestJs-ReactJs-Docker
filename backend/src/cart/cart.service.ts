import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Users } from '../users/user.entity';
import { Product } from '../products/products.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addToCart(user: Users, dto: AddToCartDto): Promise<CartItem> {
    const { productId, quantity } = dto;

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Check if product already exists in user's cart
    let cartItem = await this.cartRepo.findOne({
      where: {
        users: { id: user.id },
        product: { id: product.id },
      },
      relations: ['product', 'users'],
    });

    if (cartItem) {
      // Increase quantity if already in cart
      cartItem.quantity += quantity ?? 1;
    } else {
      // Otherwise create a new cart item
      cartItem = this.cartRepo.create({
        users: user,
        product,
        quantity: quantity ?? 1,
      });
    }

    return await this.cartRepo.save(cartItem);
  }

  async getUserCart(userId: number, page = 1, limit = 10) {
    const [items, total] = await this.cartRepo.findAndCount({
      where: { users: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async removeFromCart(userId: number, productId: number) {
    return this.cartRepo.delete({
      users: { id: userId },
      product: { id: productId },
    });
  }
}
