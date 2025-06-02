import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { User } from '../user/entities/user.entity';
import { Bill } from '../bill/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Bill])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
