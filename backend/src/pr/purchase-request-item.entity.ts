import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessProduct } from '../products/businessproduct.entity';
import { PurchaseRequest } from './purchase-requests.entity';

@Entity('purchase_request_items')
export class PurchaseRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_request_id' })
  purchaseRequest: PurchaseRequest;

  @ManyToOne(() => BusinessProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bp_id' })
  businessProduct: BusinessProduct;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  // 🔹 New field for tracking per-item approval or progress
  @Column({ length: 30, default: 'PENDING' })
  status: string; // e.g., PENDING | APPROVED | REJECTED | PARTIALLY_APPROVED

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
