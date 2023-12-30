import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('bigint')
  user_id: number;

  @Column('bigint')
  products_id: number;

  @Column('bigint')
  amount: number;

  @Column('timestamp', { nullable: true })
  bids_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;
}
