import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { ApprovalConfig } from './approval-config.entity';

@Entity('approval_config_business')
export class ApprovalConfigBusiness {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApprovalConfig, (config) => config.businessMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'approval_config_id' })
  approvalConfig: ApprovalConfig;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
