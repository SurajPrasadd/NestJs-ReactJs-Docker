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
import { Category } from './category.entity';
import { Supplier } from '../supplier/supplier.entity';
import { Pricing } from './pricing.entity';

@Entity('catalogs')
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  sku: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.catalogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @OneToMany(() => Pricing, (pricing) => pricing.catalog)
  pricingEntries: Pricing[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
