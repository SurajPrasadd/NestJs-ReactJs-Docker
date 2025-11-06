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

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 use a clear property name "purchaseRequest"
  @ManyToOne(() => PurchaseRequest, (pr) => pr.approvals, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'pr_id' })
  purchaseRequest: PurchaseRequest;

  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approvedBy: Users;

  // Level of approval (1 = first, 2 = second, etc.)
  @Column({ name: 'approval_level', type: 'int' })
  approvalLevel: number;

  @Column({ default: 'PENDING' })
  status: string; // PENDING | APPROVED | REJECTED

  @Column({ type: 'text', nullable: true })
  comments?: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
