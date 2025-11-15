import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { Product } from './products.entity';
import { CartItem } from '../cart/cart-item.entity';

@Entity('business_products')
@Unique(['business', 'product']) // prevent duplicate entries per business
export class BusinessProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business | null;

  @ManyToOne(() => Product, (product) => product.businessProducts, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({ name: 'min_quantity', type: 'int', default: 1 })
  minQuantity: number;

  @Column({ name: 'group_name', length: 100, nullable: true })
  groupName: string;

  @OneToMany(() => CartItem, (cart) => cart.businessProduct)
  cartItems: CartItem[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
