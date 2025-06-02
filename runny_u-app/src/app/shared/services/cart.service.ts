import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private cartUpdatedSubject = new Subject<void>();

  // Observable para notificar cambios en el carrito
  cartUpdated$ = this.cartUpdatedSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  getItems(): CartItem[] {
    return [...this.cartItems]; // Devolver copia para evitar mutaciones directas
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
    this.notifyChanges();
  }

  updateItemQuantity(item: CartItem, quantity: number): void {
    const existing = this.cartItems.find(i => i.name === item.name);
    if (existing) {
      existing.quantity = quantity;
      this.notifyChanges();
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
    this.notifyChanges();
  }

  clearCart(): void {
    this.cartItems = [];
    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.updateTotalItems();
    this.cartUpdatedSubject.next(); // Notificar a los suscriptores
  }

  private updateTotalItems(): void {
    const total = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalItemsSubject.next(total);
  }
} 
