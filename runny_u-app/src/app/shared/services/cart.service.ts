import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private readonly totalItemsSubject = new BehaviorSubject<number>(0);
  private readonly cartUpdatedSubject = new Subject<void>();
  private readonly STORAGE_KEY = 'cart';
  
  constructor(private readonly http: HttpClient) {
    // ⭐ Carga el carrito desde localStorage al iniciar
    this.loadCartFromStorage();
  }
  
  private readonly API_URL = 'http://localhost:3000/api';

  cartUpdated$ = this.cartUpdatedSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  // ⭐ Carga desde localStorage
  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.cartItems = JSON.parse(stored);
        this.updateTotalItems();
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems = [];
    }
  }

  // ⭐ Guarda en localStorage
  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  addItem(item: CartItem): void {
    const existing = this.cartItems.find((i) => i.name === item.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
    this.notifyChanges();
  }

  updateItemQuantity(item: CartItem, quantity: number): void {
    const existing = this.cartItems.find((i) => i.name === item.name);
    if (existing) {
      existing.quantity = quantity;
      this.notifyChanges();
    }
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
    this.notifyChanges();
  }

  clearCart(): void {
    this.cartItems = [];
    this.notifyChanges();
  }

  private notifyChanges(): void {
    this.saveCartToStorage(); // ⭐ Guarda en localStorage
    this.updateTotalItems();
    this.cartUpdatedSubject.next();
  }

  private updateTotalItems(): void {
    const total = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalItemsSubject.next(total);
  }

  createCart(cartData: any) {
    return this.http.post<{ id: string; items: CartItem[] }>(
      `${this.API_URL}/v1/cart/create`,
      cartData
    );
  }

  payCart(cartId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/v1/cart/pay/${cartId}`, {});
  }
}
