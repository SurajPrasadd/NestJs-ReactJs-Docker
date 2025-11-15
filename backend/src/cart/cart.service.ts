import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Users } from '../users/user.entity';
import { BusinessProduct } from '../products/businessproduct.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Contract } from '../contracts/contract.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,

    @InjectRepository(BusinessProduct)
    private readonly bpRepo: Repository<BusinessProduct>,

    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  // ✅ Add item to user's cart
  async addToCart(user: Users, dto: AddToCartDto): Promise<CartItem> {
    const { bpId, quantity } = dto;

    // 🔹 Step 1: Find the BusinessProduct
    const businessProduct = await this.bpRepo.findOne({
      where: { id: bpId },
      relations: ['product', 'business'],
    });
    if (!businessProduct)
      throw new NotFoundException('Business product not found');

    const today = new Date();
    // 🔹 Step 2: Try to find an active Contract for this user + business + businessProduct
    const contract = await this.contractRepo.findOne({
      where: [
        {
          buyer: { id: user.id },
          business: { id: businessProduct.business?.id },
          businessProduct: { id: businessProduct.id },
          isActive: true,
          endDate: IsNull(), // Case 1: No end date
        },
        {
          buyer: { id: user.id },
          business: { id: businessProduct.business?.id },
          businessProduct: { id: businessProduct.id },
          isActive: true,
          endDate: MoreThanOrEqual(today), // Case 2: Not expired yet
        },
      ],
      relations: ['buyer', 'business', 'businessProduct'],
    });

    // 🔹 Step 3: Check if product already in cart
    let cartItem = await this.cartRepo.findOne({
      where: {
        users: { id: user.id },
        businessProduct: { id: businessProduct.id },
      },
      relations: ['businessProduct', 'users', 'contract'],
    });

    // 🔹 Step 4: Update or create
    if (cartItem) {
      cartItem.quantity = quantity ?? 1;
      cartItem.contract = contract ?? null; // link contract if exists
    } else {
      cartItem = this.cartRepo.create({
        users: user,
        businessProduct,
        quantity: quantity ?? 1,
        contract: contract ?? null,
      });
    }

    // 🔹 Step 5: Save
    return await this.cartRepo.save(cartItem);
  }

  // ✅ Get all cart items for a user (paginated)
  async getUserCart(userId: number, page = 1, limit = 10) {
    if (page == 1) {
      await this.refreshCartContracts();
    }

    const query = this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.contract', 'contract')
      .leftJoinAndSelect('cart.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product')
      .leftJoinAndSelect('product.images', 'images', 'images.isPrimary = true') // ✅ Only primary image
      .where('cart.users_id = :userId', { userId })
      .orderBy('cart.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await query.getManyAndCount();

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

  async refreshCartContracts(): Promise<number> {
    const today = new Date();

    // 1️⃣ Find all cart items where contract exists and is expired
    const carts = await this.cartRepo.find({
      where: {
        contract: {
          endDate: MoreThanOrEqual(today), // ❌ as per your requirement (>= today)
        },
      },
      relations: ['contract'],
    });

    // 2️⃣ Unlink contract
    for (const cart of carts) {
      cart.contract = null;
    }

    // 3️⃣ Save all changes
    await this.cartRepo.save(carts);

    return carts.length; // number of cart items updated
  }
}
