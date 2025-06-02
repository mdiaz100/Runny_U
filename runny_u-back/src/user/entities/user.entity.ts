import { Cart } from 'src/cart/entities/cart.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
