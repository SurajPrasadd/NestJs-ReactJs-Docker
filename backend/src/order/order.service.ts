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
    // 1️⃣ Fetch all cart items with contracts
    const cartItems = await this.cartRepo.find({
      where: {
        users: { id: user.id },
        contract: Not(IsNull()),
      },
      relations: ['businessProduct', 'contract', 'businessProduct.product'],
    });

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
      status: 'PENDING',
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
        status: 'PENDING',
      }),
    );

    // 6️⃣ Save order (with cascade on items)
    const savedOrder = await this.orderRepo.save(order);

    // 7️⃣ (Optional) Clear those cart items
    await this.cartRepo.remove(cartItems);

    return savedOrder;
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
      .leftJoinAndSelect('bp.business', 'business')
      .leftJoinAndSelect('order.createdBy', 'createdBy');

    if (status) qb.andWhere('order.status = :status', { status });
    if (userId) qb.andWhere('createdBy.id = :userId', { userId });
    if (businessId) qb.andWhere('business.id = :businessId', { businessId });

    if (search) {
      qb.andWhere(
        `(order.orderNumber ILIKE :search OR order.remarks ILIKE :search OR order.deliveryAddress ILIKE :search)`,
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

  async updateOrder(id: number, dto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Apply updates
    if (dto.status) order.status = dto.status;
    if (dto.remarks) order.remarks = dto.remarks;
    if (dto.deliveryAddress) order.deliveryAddress = dto.deliveryAddress;
    if (dto.expectedDeliveryDate)
      order.expectedDeliveryDate = new Date(dto.expectedDeliveryDate);

    // Recalculate totalAmount if needed
    if (order.items && order.items.length > 0) {
      order.totalAmount = order.items.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0,
      );
    }

    return await this.orderRepo.save(order);
  }
}
