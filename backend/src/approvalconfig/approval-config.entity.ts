import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { ApprovalConfigBusiness } from './approval-config-business.entity';

@Entity('approval_config')
export class ApprovalConfig {
  @PrimaryGeneratedColumn()
  id: number;

  // User or approver for this level
  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  // Level of approval (1 = first, 2 = second, etc.)
  @Column({ name: 'approval_level', type: 'int' })
  approvalLevel: number;

  // Minimum amount for which this approver is responsible
  @Column({
    name: 'min_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  minAmount: number;

  // Maximum amount this approver can approve
  @Column({
    name: 'max_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  maxAmount: number;

  // If true, auto-approve PRs under this user’s range
  @Column({ name: 'auto_approve', default: false })
  autoApprove: boolean;

  // ✅ One config → many business mappings
  @OneToMany(() => ApprovalConfigBusiness, (map) => map.approvalConfig, {
    cascade: true,
  })
  businessMappings: ApprovalConfigBusiness[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
