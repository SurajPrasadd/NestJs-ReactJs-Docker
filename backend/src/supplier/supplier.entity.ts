import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { Contact } from './contract.entity';
import { Catalog } from '../products/catalogs.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'contact_email', length: 100, nullable: true })
  contactEmail: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // One supplier can have many users (sellers, approvers, etc.)
  @OneToMany(() => Users, (user) => user.supplier)
  users: Users[];

  // One supplier can have many contacts
  @OneToMany(() => Contact, (contact) => contact.supplier)
  contacts: Contact[];

  // One supplier can have many catalogs
  @OneToMany(() => Catalog, (catalog) => catalog.supplier)
  catalogs: Catalog[];
}
