import { Cart } from 'src/cart/entities/cart.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Generated,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'number_bill' })
  numberBill: number;

  @Column()
  total: number;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @OneToOne(() => Cart, (cart) => cart.bill)
  @JoinColumn()
  cart: Cart

}