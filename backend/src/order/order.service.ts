// order.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, SelectQueryBuilder } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Users } from '../users/user.entity';
import { GetOrdersDto } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_STATUS } from '../common/constants/app.constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  async createOrderFromCart(user: Users) {
    const today = new Date().toISOString().split('T')[0];

    // 1️⃣ Fetch all cart items with contracts
    const cartItems = await this.cartRepo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.businessProduct', 'businessProduct')
      .leftJoinAndSelect('businessProduct.product', 'product')
      .leftJoinAndSelect('cart.contract', 'contract')
      .where('cart.contract_id IS NOT NULL') // has contract
      .andWhere(
        `
      contract.end_date IS NOT NULL
      AND contract.end_date > :today
    `,
        { today },
      )
      .getMany();

    if (!cartItems.length) {
      throw new NotFoundException('No cart items with valid contracts found.');
    }

    // 2️⃣ Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.contract?.price || 0) * item.quantity,
      0,
    );

    // 3️⃣ Create order number (simple example)
    const orderNumber = `ORD-${Date.now()}`;

    // 4️⃣ Create order entity
    const order = this.orderRepo.create({
      orderNumber,
      createdBy: user,
      totalAmount,
      status: ORDER_STATUS.PENDING,
      isActive: true,
      items: [],
    });

    // 5️⃣ Map cart items → order items
    order.items = cartItems.map((cart) =>
      this.orderItemRepo.create({
        prNumber: cart.contract?.prNumber,
        businessProduct: cart.businessProduct,
        quantity: cart.quantity,
        price: Number(cart.contract?.price || 0),
        status: ORDER_STATUS.PENDING,
      }),
    );

    // 6️⃣ Save order (with cascade on items)
    const savedOrder = await this.orderRepo.save(order);

    // 7️⃣ (Optional) Clear those cart items
    // await this.cartRepo.remove(cartItems);

    return null;
  }

  async getAllOrders(dto: GetOrdersDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      businessId,
      userId,
      search,
    } = dto;

    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const qb: SelectQueryBuilder<Order> = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'orderItem')
      .leftJoinAndSelect('orderItem.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product')
      .leftJoinAndSelect('bp.business', 'business');

    if (status) qb.andWhere('order.status = :status', { status });
    if (userId) qb.andWhere('order.created_by = :userId', { userId });
    if (businessId) qb.andWhere('business.id = :businessId', { businessId });

    if (search) {
      qb.andWhere(
        `(order.orderNumber ILIKE :search OR product.name ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const validSortFields = [
      'createdAt',
      'orderNumber',
      'totalAmount',
      'status',
    ];
    const orderField = validSortFields.includes(sortBy)
      ? `order.${sortBy}`
      : 'order.createdAt';

    qb.orderBy(orderField, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');
    qb.skip(skip).take(take);

    const [orders, total] = await qb.getManyAndCount();

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateOrder(dto: UpdateOrderDto, invoicePaths: string | null) {
    const order = await this.orderRepo.findOne({
      where: { id: dto.id },
      relations: ['items', 'items.businessProduct'],
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    // 🔹 Update primitive fields
    if (dto.status) order.status = dto.status;
    if (dto.remarks) order.remarks = dto.remarks;
    if (dto.deliveryAddress) order.deliveryAddress = dto.deliveryAddress;
    if (dto.expectedDeliveryDate)
      order.expectedDeliveryDate = new Date(dto.expectedDeliveryDate);

    // 🔹 Update invoice link if file uploaded
    if (invoicePaths) {
      order.invoicelink = invoicePaths; // S3/local path
    } else if (dto.invoicelink) {
      order.invoicelink = dto.invoicelink;
    }

    // 🔹 Handle Order Items
    if (dto.items && dto.items.length > 0) {
      for (const itemDto of dto.items) {
        // 🔹 UPDATE EXISTING ITEM
        if (itemDto.id) {
          const existingItem = order.items.find((it) => it.id === itemDto.id);
          if (!existingItem) continue;

          if (itemDto.prNumber) existingItem.prNumber = itemDto.prNumber;
          if (itemDto.bpId) {
            existingItem.businessProduct = { id: itemDto.bpId } as any;
          }
          if (itemDto.quantity)
            existingItem.quantity = Number(itemDto.quantity);
          if (itemDto.price) existingItem.price = Number(itemDto.price);
          if (itemDto.comment !== undefined)
            existingItem.comment = itemDto.comment;
          if (itemDto.status) existingItem.status = itemDto.status;
        } else {
          // 🔹 ADD NEW ITEM
          const newItem = this.orderItemRepo.create({
            prNumber: itemDto.prNumber,
            businessProduct: { id: itemDto.bpId } as any,
            quantity: itemDto.quantity || 1,
            price: itemDto.price || 0,
            comment: itemDto.comment,
            status: itemDto.status || 'PENDING',
            order: order,
          });

          order.items.push(newItem);
        }
      }
    }

    // 🔹 Recalculate total
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );

    // 🔹 Save everything
    return await this.orderRepo.save(order);
  }
}
