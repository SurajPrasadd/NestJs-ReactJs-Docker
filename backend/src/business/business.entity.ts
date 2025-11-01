import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { Catalog } from '../products/catalogs.entity';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'business_name', length: 150 })
  businessName: string;

  @Column({ name: 'business_email', length: 100, nullable: true })
  businessEmail: string;

  @Column({ name: 'business_phone', length: 50, nullable: true })
  businessPhone: string;

  @Column({ name: 'business_address', type: 'text', nullable: true })
  businessAddress: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // One business can have many users (sellers, approvers, etc.)
  @OneToMany(() => Users, (user) => user.business)
  users: Users[];

  // One business can have many catalogs
  @OneToMany(() => Catalog, (catalog) => catalog.business)
  catalogs: Catalog[];
}
