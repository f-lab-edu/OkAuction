import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // 데이터베이스 테이블 이름
export class User {
  @PrimaryGeneratedColumn()
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
    enum: ['Admin', 'User', 'Guest'], // 실제 역할 값으로 대체해야 합니다.
    default: 'User',
  })
  u_role: string;

  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    default: 'N',
  })
  u_signout: string;
}
