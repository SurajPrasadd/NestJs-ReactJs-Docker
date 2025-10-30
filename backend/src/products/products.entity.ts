import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Catalog } from './catalogs.entity';
import { Category } from './category.entity';
import { Supplier } from '../supplier/supplier.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation: Many products belong to one catalog
  @ManyToOne(() => Catalog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'catalog_id' })
  catalog: Catalog;

  // Relation: Many products belong to one category
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // Relation: Many products belong to one supplier
  @ManyToOne(() => Supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ length: 10, default: 'Rs' })
  currency: string;

  @Column({ name: 'min_quantity', type: 'int', nullable: true })
  minQuantity: number;

  @Column({ name: 'max_quantity', type: 'int', nullable: true })
  maxQuantity: number;

  @Column({ name: 'total_quantity', type: 'int', nullable: true })
  totalQuantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
