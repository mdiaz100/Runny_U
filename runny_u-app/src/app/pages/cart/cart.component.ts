import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { CartService } from '../../shared/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  providers: [CurrencyPipe]
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private cartSubscription!: Subscription;
  
  // Services
  private cartService = inject(CartService);
  private currencyPipe = inject(CurrencyPipe);

  ngOnInit(): void {
    this.loadCartItems();
    this.setupCartUpdates();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  private loadCartItems(): void {
    this.items = this.cartService.getItems();
  }

  private setupCartUpdates(): void {
    this.cartSubscription = this.cartService.cartUpdated$.subscribe({
      next: () => this.loadCartItems()
    });
  }

  onGetTotal(): number {
    return this.cartService.getTotal();
  }

  getFormattedTotal(): string {
    return this.currencyPipe.transform(this.onGetTotal(), 'USD', 'symbol', '1.2-2') || '';
  }

  onIncreaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item, item.quantity + 1);
  }

  onDecreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item, item.quantity - 1);
    } else {
      this.onRemoveItem(item);
    }
  }

  onRemoveItem(item: CartItem): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      this.cartService.removeItem(item);
    }
  }

  onClearCart(): void {
    if (this.items.length > 0 && confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  onCheckout(): void {
    if (this.items.length === 0) return;
    
    // Aquí iría la lógica para procesar el pago
    console.log('Procesando pago...', this.items);
    // this.router.navigate(['/checkout']);
    
    // Opcional: Mostrar confirmación
    alert('Redirigiendo al proceso de pago...');
  }

  trackByItems(index: number): number {
    return index; // Solución simple si no tienes IDs únicos
  }
} 
