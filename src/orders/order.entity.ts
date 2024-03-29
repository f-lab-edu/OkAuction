import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  product_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ length: 100, default: '조심히 안전하게 와주세요' })
  o_req: string;

  @Column({ length: 200 })
  o_address: string;

  @Column()
  o_addr_postcode: number;

  @Column({ length: 50, nullable: true })
  o_address_sub: string;

  @Column()
  o_price: number;

  @Column({
    type: 'enum',
    enum: ['Temp', 'Confirmed', 'End'],
    default: 'Temp',
  })
  o_status: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Prepared', 'Shipped', 'Delivered', 'Returned'],
    default: 'Pending',
  })
  o_shipping: string;

  @Column({ default: 0 })
  used_point: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => Product, (product) => product.order)
  product: Product;
}
