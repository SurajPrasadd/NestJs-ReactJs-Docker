import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Users } from '../users/user.entity';
import { BusinessProduct } from '../products/businessproduct.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,

    @InjectRepository(BusinessProduct)
    private readonly bpRepo: Repository<BusinessProduct>,
  ) {}

  // ✅ Add item to user's cart
  async addToCart(user: Users, dto: AddToCartDto): Promise<CartItem> {
    const { bpId, quantity } = dto;

    const businessProduct = await this.bpRepo.findOne({
      where: { id: bpId },
      relations: ['product', 'business'],
    });
    if (!businessProduct)
      throw new NotFoundException('Business product not found');

    // ✅ Check if businessProduct already exists in user's cart
    let cartItem = await this.cartRepo.findOne({
      where: {
        users: { id: user.id },
        businessProduct: { id: businessProduct.id },
      },
      relations: ['businessProduct', 'users'],
    });

    if (cartItem) {
      cartItem.quantity = quantity ?? 1;
    } else {
      cartItem = this.cartRepo.create({
        users: user,
        businessProduct,
        quantity: quantity ?? 1,
        contractProd: false,
      });
    }

    return await this.cartRepo.save(cartItem);
  }

  // ✅ Get all cart items for a user (paginated)
  async getUserCart(userId: number, page = 1, limit = 10) {
    const [items, total] = await this.cartRepo.findAndCount({
      where: { users: { id: userId } },
      relations: [
        'businessProduct',
        'businessProduct.product',
        'businessProduct.product.images',
      ],
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

  // ✅ Remove item from user's cart
  async removeFromCart(id: number) {
    return this.cartRepo.delete({ id });
  }
}
