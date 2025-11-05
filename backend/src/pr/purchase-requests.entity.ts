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
import { BusinessProduct } from '../products/businessproduct.entity';
import { Approval } from 'src/approval/approval.entity';

@Entity('purchase_requests')
export class PurchaseRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  prNumber: string;

  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requested_by' })
  requestedBy: Users;

  // Each cart item refers to one product
  @ManyToOne(() => BusinessProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bp_id' })
  businessProduct: BusinessProduct;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ default: 'PENDING' })
  status: string; // PENDING | PARTIALLY_APPROVED | APPROVED | REJECTED

  // 👇 Correct relation field name for clarity
  @OneToMany(() => Approval, (approval) => approval.purchaseRequest, {
    cascade: true,
  })
  approvals: Approval[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
