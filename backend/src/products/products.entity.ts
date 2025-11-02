import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Business } from '../business/business.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation: Many products belong to one category
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  // Relation: Many products belong to one business
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'product_image', length: 150, nullable: true })
  productImage: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ length: 10, default: 'Rs' })
  currency: string;

  @Column({ name: 'min_quantity', type: 'int', nullable: true })
  minQuantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
