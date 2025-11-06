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
import { Approval } from '../approval/approval.entity';
import { PurchaseRequestItem } from './purchase-request-item.entity';

@Entity('purchase_requests')
export class PurchaseRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  prNumber: string;

  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'requested_by' })
  requestedBy: Users;

  // 🔹 New field: grouping multiple PRs logically
  @Column({ name: 'group_name', length: 100, nullable: true })
  groupName: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'PENDING' })
  status: string; // PENDING | PARTIALLY_APPROVED | APPROVED | REJECTED

  @OneToMany(() => Approval, (approval) => approval.purchaseRequest, {
    cascade: true,
  })
  approvals: Approval[];

  @OneToMany(() => PurchaseRequestItem, (item) => item.purchaseRequest, {
    cascade: true,
  })
  items: PurchaseRequestItem[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
