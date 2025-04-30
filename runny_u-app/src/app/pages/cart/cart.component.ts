import { Component, inject, OnInit } from '@angular/core';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { CartService } from '../../shared/services/cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [NgFor, NgIf]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  cartService = inject(CartService);

  ngOnInit(): void {
    this.items = this.cartService.getItems();
  }

  onGetTotal(): number {
    return this.cartService.getTotal();
  }

  onIncreaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  onDecreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.onRemoveItem(item);
    }
  }

  onRemoveItem(item: CartItem): void {
    this.cartService.removeItem(item);         
    this.items = this.cartService.getItems();
  }

  onClearCart(): void {
    this.cartService.clearCart();
    this.items = [];
  }
}

