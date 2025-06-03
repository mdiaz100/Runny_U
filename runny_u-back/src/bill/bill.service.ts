import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
  ) {}

  async getBillsByUser(
    userId: string,
  ): Promise<{ numberBill: number; items: any[] }[]> {
    const bills = await this.billRepository.find({
      relations: ['cart', 'cart.user'],
      where: { cart: { user: { id: userId } } },
    });

    return bills.map((bill) => ({
      numberBill: bill.numberBill,
      items: bill.cart.cartItems,
      total: bill.total,
    }));
  }
}
