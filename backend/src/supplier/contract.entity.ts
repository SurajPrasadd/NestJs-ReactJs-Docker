import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ length: 255, nullable: true })
  contract_title?: string;

  @Column({ type: 'text' })
  terms_and_conditions: string;

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  expires_on?: Date;

  @Column({ type: 'int', default: 1, comment: '1-active | 0-expired | 2-pending' })
  contract_status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
