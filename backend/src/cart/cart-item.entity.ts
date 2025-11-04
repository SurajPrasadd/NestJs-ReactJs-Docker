import { Users } from '../users/user.entity';
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

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Each cart item refers to one product
  @ManyToOne(() => BusinessProduct, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bp_id' })
  businessProduct: BusinessProduct;

  @ManyToOne(() => Users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'users_id' })
  users: Users;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'contract_prod', default: false })
  contractProd: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
