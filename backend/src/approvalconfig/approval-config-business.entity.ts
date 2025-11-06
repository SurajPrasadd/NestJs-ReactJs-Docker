import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  // 🔁 Replaced Business relation with groupName (string)
  @Column({ name: 'group_name', type: 'varchar', length: 100 })
  groupName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
