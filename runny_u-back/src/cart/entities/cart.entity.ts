import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CartItem } from '../dto/cart-item.dto';
import { User } from 'src/user/entities/user.entity';
import { Bill } from 'src/bill/entities/bill.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' , name: 'cart_items'})
    cartItems: CartItem[];

  @Column()
  total: number;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => Bill, (bill) => bill.cart)
  bill: Bill;

}
