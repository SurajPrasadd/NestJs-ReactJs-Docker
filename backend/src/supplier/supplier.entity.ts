import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Catalog } from '../catalogs/catalogs.entity';
import { Pricing } from '../catalogs/pricing.entity';
import { Contract } from './contract.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ name: 'contact_person', length: 100, nullable: true })
  contactPerson?: string;

  @Column({ name: 'contact_email', length: 255, nullable: true })
  contactEmail?: string;

  @Column({ name: 'contact_phone', length: 20, nullable: true })
  contactPhone?: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '1-active | 0-inactive | 2-pending',
  })
  status: number;

  @OneToMany(() => Catalog, (catalog) => catalog.supplier)
  catalogs: Catalog[];

  @OneToMany(() => Pricing, (pricing) => pricing.supplier)
  pricingEntries: Pricing[];

  @OneToMany(() => Contract, (contract) => contract.supplier)
  contracts: Contract[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
