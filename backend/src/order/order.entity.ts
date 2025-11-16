import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', length: 50, unique: true })
  orderNumber: string;

  // 🔹 User who created/placed the order
  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: Users;

  // 🔹 Order total amount
  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  // 🔹 Order status
  @Column({ length: 30, default: 'PENDING' })
  status: string; // PENDING | APPROVED | REJECTED | COMPLETED | CANCELLED

  // 🔹 Optional remarks
  @Column({ type: 'text', nullable: true })
  remarks: string;

  // 🔹 Delivery details
  @Column({ name: 'delivery_address', type: 'text', nullable: true })
  deliveryAddress: string | null;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date | null;

  @Column({ type: 'text', nullable: true })
  invoicelink: string | null;

  // 🔹 Linked order items
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
