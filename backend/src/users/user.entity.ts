import { Session } from '../auth/session.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany(() => Session, (s) => s.user)
  sessions: Session[];
}
