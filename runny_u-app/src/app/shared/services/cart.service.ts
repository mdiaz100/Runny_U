import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private totalItemsSubject = new BehaviorSubject<number>(0);

  totalItems$ = this.totalItemsSubject.asObservable();

  getItems(): CartItem[] {
    return this.cartItems;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  addItem(item: CartItem): void {
    const existing = this.cartItems.find(i => i.name === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
    this.updateTotalItems();
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.updateTotalItems();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateTotalItems();
  }

  private updateTotalItems(): void {
    const total = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalItemsSubject.next(total);
  }
}
