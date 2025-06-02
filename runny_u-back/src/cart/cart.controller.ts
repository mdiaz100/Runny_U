import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Controller('v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create')
  create(@Body() body: Cart) {
    return this.cartService.createCart(body.user, body.cartItems);
  }

  @Get('user/:userId')
  getUserCarts(@Param('userId') userId: string) {
    return this.cartService.getUserCarts(userId);
  }

  @Get(':id')
  getCart(@Param('id') id: string) {
    return this.cartService.getCartById(id);
  }

  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() body: UpdateCartDto) {
    return this.cartService.updateCart(id, body);
  }

  @Delete(':id')
  deleteCart(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }

  @Post(':id/pay')
  payCart(@Param('id') id: string) {
    return this.cartService.generateBill(id);
  }
}
