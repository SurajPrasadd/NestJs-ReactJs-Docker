import { Business } from '../business/business.entity';
import { Session } from '../auth/session.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Contact } from '../business/contract.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string; // hashed password (bcrypt)

  @Column({ nullable: true })
  name?: string;

  @Column()
  role: string;

  @ManyToOne(() => Business, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToOne(() => Contact, (contact) => contact.users)
  contact: Contact;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Session, (s) => s.user)
  sessions: Session[];
}
