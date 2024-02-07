import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Order } from 'src/orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  c_id: number;

  @Column({ nullable: true })
  c_id2: number;

  @Column()
  user_id: number;

  @Index('product_name_index', { unique: true })
  @Column({ length: 50, nullable: true })
  p_name: string;

  @Column({ length: 1000, nullable: true })
  p_info: string;

  @Column({ default: 0 })
  p_b_price: number;

  @CreateDateColumn()
  p_created_at: Date;

  @UpdateDateColumn({ nullable: true })
  p_updated_at: Date;

  @Column({ default: 0 })
  p_hit: number;

  @Column({ default: 7 })
  p_dur_date: number;

  @Column({
    type: 'enum',
    enum: ['Available', 'Pending', 'Sold'],
    default: 'Available',
  })
  p_sales_status: string;

  @Column()
  p_address: string;

  @Column({ length: 50, nullable: true })
  p_address_sub: string;

  @Column()
  p_addr_postcode: number;

  @Column({ default: 0 })
  p_like: number;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ nullable: true, type: 'bigint' })
  highest_bid: string;

  @Column({ length: 100, nullable: true })
  main_img_id: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToOne(() => Order, (order) => order.product)
  order: Order;
}
