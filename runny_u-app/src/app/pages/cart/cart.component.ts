import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { CartService } from '../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CurrencyPipe],
})
export class CartComponent implements OnInit, OnDestroy {
  isCartSaved: boolean = false;
  cartId: string = '';

  items: CartItem[] = [];
  private cartSubscription!: Subscription;
  authService = inject(AuthService);

  private readonly cartService = inject(CartService);
  private readonly currencyPipe = inject(CurrencyPipe);

  ngOnInit(): void {
    (window as any).component = this;
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
      next: () => this.loadCartItems(),
    });
  }

  onGetTotal(): number {
    return this.cartService.getTotal();
  }

  getFormattedTotal(): string {
    return (
      this.currencyPipe.transform(
        this.onGetTotal(),
        'USD',
        'symbol',
        '1.2-2'
      ) || ''
    );
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: ' #ffab00',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeItem(item);
        Swal.fire({
          title: 'Eliminado',
          text: 'El producto fue eliminado del carrito.',
          icon: 'success',
          confirmButtonColor: '#4CAF50', // <- Cambia este color como desees
          confirmButtonText: 'OK',
        });
      }
    });
  }

  onClearCart(): void {
    if (this.items.length === 0) return;

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: '¿Estás seguro de que quieres vaciar el carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: ' #ffab00',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire({
          title: 'Eliminado',
          text: 'El producto fue eliminado del carrito.',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  onSaveCart(): void {
    const userData = this.authService.getUser();

    const userId = userData?.id;

    const cartRequest = {
      user: { id: userId },
      cartItems: this.items,
    };

    this.cartService.createCart(cartRequest).subscribe({
      next: (response) => {
        Swal.fire(
          'Guardado',
          'El carrito ha sido guardado con éxito',
          'success'
        );
        this.isCartSaved = true;
        this.cartId = response.id;
      },
      error: () => {
        Swal.fire('Error', 'No se pudo guardar el carrito', 'error');
      },
    });
  }

  onPayCart(): void {
    if (!this.isCartSaved || !this.cartId) return;

    this.cartService.payCart(this.cartId).subscribe({
      next: (bill) => {
        const numberBill = bill.numberBill;
        const total = bill.total;

        Swal.fire(
          'Factura Generada',
          `Reclama con la Factura #${numberBill}, su valor total es de ${total}`,
          'success'
        );

        this.cartService.clearCart();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo generar la factura', 'error');
      },
    });
  }

  trackByItems(index: number): number {
    return index;
  }
}
