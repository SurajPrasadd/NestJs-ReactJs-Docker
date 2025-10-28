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
import { Catalog } from './catalogs.entity';

@Entity('pricing')
export class Pricing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.pricingEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @ManyToOne(() => Catalog, (catalog) => catalog.pricingEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'catalogsId' })
  catalog: Catalog;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseRate?: number;

  @Column({ type: 'int', default: 1 })
  minQty: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercent: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
