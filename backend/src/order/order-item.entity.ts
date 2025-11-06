import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { BusinessProduct } from '../products/businessproduct.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pr_number', type: 'text', nullable: true })
  prNumber: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => BusinessProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bp_id' })
  businessProduct: BusinessProduct;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  // 🔹 Status of each order item
  @Column({ length: 30, default: 'PENDING' })
  status: string; // e.g., PENDING | SHIPPED | DELIVERED | CANCELLED

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
