import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { Business } from '../business/business.entity';
import { BusinessProduct } from '../products/businessproduct.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pr_number', type: 'text', nullable: true })
  prNumber: string;

  // Buyer is a user (e.g., company buyer or approver)
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Users;

  // business party in the contract
  @ManyToOne(() => Business, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'business_id' })
  business: Business | null;

  @ManyToOne(() => BusinessProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bp_id' })
  businessProduct: BusinessProduct;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text', nullable: true })
  contractslink: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
