import { Injectable } from '@angular/core';
import { CartItem } from '../shared/interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  getItems(): CartItem[] {
    return this.cartItems;
  }

  addItem(item: CartItem): void {
    const existing = this.cartItems.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
