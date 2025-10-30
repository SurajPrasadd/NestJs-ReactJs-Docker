import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { Supplier } from '../supplier/supplier.entity';
import { Product } from '../products/products.entity';

export enum OrderStatus {
  ORDER_SUBMISSION = 1,
  ORDER_APPROVAL = 2,
  PAYMENT_PROCESSING = 3,
  SHIPPING = 4,
  DELIVERED = 5,
}

@Entity('order_history')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  id: number;

  // Product associated with this order
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Buyer (user who placed the order)
  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Users;

  // Supplier fulfilling the order
  @ManyToOne(() => Supplier, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  totalAmount: number;

  @CreateDateColumn({ name: 'order_date', type: 'timestamp with time zone' })
  orderDate: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    type: 'int',
    default: OrderStatus.ORDER_SUBMISSION,
    comment:
      '1=Order submission, 2=Order approval, 3=Payment processing, 4=Shipping, 5=Delivered',
  })
  status: OrderStatus;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
