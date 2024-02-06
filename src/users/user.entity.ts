import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  VersionColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Order } from 'src/orders/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  u_id: string;

  @Column({ length: 100, nullable: true })
  u_social: string;

  @Column({ length: 150 })
  u_password: string;

  @Column({ length: 50, nullable: true })
  u_email: string;

  @Column({ length: 20 })
  u_name: string;

  @Column({ length: 15 })
  u_jumin: string;

  @Column({ length: 15, nullable: true })
  u_phone: string;

  @Column('int')
  u_addr_postcode: number;

  @Column({ length: 200 })
  u_address: string;

  @Column({ length: 50, nullable: true })
  u_address_sub: string;

  @Column({ length: 50 })
  u_nickname: string;

  @Column({ length: 50, nullable: true })
  u_account: string;

  @Column('bigint', { default: 0 })
  u_point: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  u_created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  u_updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  u_suspension: Date;

  @Column({
    type: 'enum',
    enum: ['Admin', 'User', 'Guest'],
    default: 'User',
  })
  u_role: string;

  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    default: 'N',
  })
  u_signout: string;

  @VersionColumn()
  version: number;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
