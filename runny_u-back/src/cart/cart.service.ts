import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Bill } from '../bill/entities/bill.entity';
import { CartItem } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Bill)
    private billRepository: Repository<Bill>
  ) {}

  async createCart(user: User, cartItems: CartItem[]): Promise<Cart> {
  /*const user = await this.userRepository.findOneBy({ id: userId });
  if (!user) {
    throw new Error('User not found');
  };
*/
  const cart = this.cartRepository.create({
    user: user,
    cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  });

  return this.cartRepository.save(cart);
}


  async getUserCarts(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({ where: { user: { id: userId } }, relations: ['bill'] });
  }

async getCartById(id: string): Promise<Cart> {
  const cart = await this.cartRepository.findOne({
    where: { id },
    relations: ['bill', 'user'],
  });

  if (!cart) {
    throw new NotFoundException(`Cart with id ${id} not found`);
  }

  return cart;
}

async updateCart(cartId: string, update: UpdateCartDto): Promise<Cart> {
  const cart = await this.getCartById(cartId);

  // Validar que cartItem existe y es un arreglo
  if (!update.cartItem || !Array.isArray(update.cartItem)) {
    throw new Error('Cart items must be provided as an array.');
  }

  cart.cartItems = update.cartItem;
  cart.total = update.cartItem.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return this.cartRepository.save(cart);
}


  async deleteCart(cartId: string): Promise<void> {
    await this.cartRepository.delete(cartId);
  }

  async generateBill(cartId: string): Promise<Bill> {
  const cart = await this.getCartById(cartId);

  const lastBills = await this.billRepository.find({
    order: { numberBill: 'DESC' },
    take: 1,
  });
  const lastBill = lastBills[0];
  const nextNumber = lastBill ? lastBill.numberBill + 1 : 1;

  const bill = this.billRepository.create({
    total: cart.total,
    numberBill: nextNumber,
    cart: cart,
  });

  if (bill.total <= 0) {
  throw new Error('Cannot generate bill from an empty cart.');
}

  return this.billRepository.save(bill);
}

}
