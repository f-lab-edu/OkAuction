import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  c_id: number;

  @Column({ nullable: true })
  c_id2: number;

  @Column()
  c_name: string;
}
