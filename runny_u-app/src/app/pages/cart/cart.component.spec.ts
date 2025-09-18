import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let authServiceMock: any;
  let cartServiceMock: any;
  let cartUpdated$: Subject<void>;

  beforeEach(async () => {
    cartUpdated$ = new Subject<void>();

    authServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue({ id: '123' })
    };

    cartServiceMock = {
      getItems: jasmine.createSpy('getItems').and.returnValue([]),
      cartUpdated$: cartUpdated$.asObservable(),
      updateItemQuantity: jasmine.createSpy('updateItemQuantity'),
      removeItem: jasmine.createSpy('removeItem'),
      clearCart: jasmine.createSpy('clearCart'),
      getTotal: jasmine.createSpy('getTotal').and.returnValue(200),
      createCart: jasmine.createSpy('createCart'),
      payCart: jasmine.createSpy('payCart')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false
      } as SweetAlertResult<any>)
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CartComponent],
      providers: [
        CurrencyPipe,
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    component.items = [
      { id: '1', name: 'Producto A', quantity: 2, price: 100, image: 'img.png' }
    ];
  });

  it('debería guardar carrito con éxito', () => {
    const mockResponse = { id: '456' };
    cartServiceMock.createCart.and.returnValue(of(mockResponse));

    component.onSaveCart();

    expect(authServiceMock.getUser).toHaveBeenCalled();
    expect(cartServiceMock.createCart).toHaveBeenCalledWith({
      user: { id: '123' },
      cartItems: component.items
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      'Guardado',
      'El carrito ha sido guardado con éxito',
      'success'
    );
    expect(component.isCartSaved).toBeTrue();
    expect(component.cartId).toEqual('456');
  });

  it('debería mostrar error si falla el guardado del carrito', () => {
    cartServiceMock.createCart.and.returnValue(
      throwError(() => new Error('Error en API'))
    );

    component.onSaveCart();

    expect(authServiceMock.getUser).toHaveBeenCalled();
    expect(cartServiceMock.createCart).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No se pudo guardar el carrito',
      'error'
    );
    expect(component.isCartSaved).toBeFalse();
    expect(component.cartId).toBe('');
  });

  it('debería aumentar la cantidad de un item', () => {
    const item = component.items[0];
    component.onIncreaseQuantity(item);
    expect(cartServiceMock.updateItemQuantity).toHaveBeenCalledWith(item, 3);
  });

  it('debería disminuir la cantidad si es mayor a 1', () => {
    const item = component.items[0];
    component.onDecreaseQuantity(item);
    expect(cartServiceMock.updateItemQuantity).toHaveBeenCalledWith(item, 1);
  });

  it('debería eliminar el item si la cantidad es 1 y se intenta disminuir', async () => {
    const item = { ...component.items[0], quantity: 1 };
    await component.onDecreaseQuantity(item);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith(item);
  });

  it('debería eliminar un item con confirmación', async () => {
    const item = component.items[0];
    await component.onRemoveItem(item);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith(item);
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('no debería vaciar el carrito si no hay items', async () => {
    component.items = [];
    await component.onClearCart();
    expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
  });

  it('debería vaciar el carrito con confirmación', async () => {
    await component.onClearCart();
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debería pagar carrito con éxito', () => {
    component.isCartSaved = true;
    component.cartId = 'cart123';
    const mockBill = { numberBill: 'BILL001', total: 300 };
    cartServiceMock.payCart.and.returnValue(of(mockBill));

    component.onPayCart();

    expect(cartServiceMock.payCart).toHaveBeenCalledWith('cart123');
    expect(Swal.fire).toHaveBeenCalledWith(
      'Factura Generada',
      jasmine.stringMatching(/Factura #BILL001/),
      'success'
    );
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
  });

  it('debería mostrar error si falla el pago del carrito', () => {
    component.isCartSaved = true;
    component.cartId = 'cart123';
    cartServiceMock.payCart.and.returnValue(
      throwError(() => new Error('Error al pagar'))
    );

    component.onPayCart();

    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'No se pudo generar la factura',
      'error'
    );
  });

  it('debería devolver el total formateado', () => {
    const total = component.getFormattedTotal();
    expect(cartServiceMock.getTotal).toHaveBeenCalled();
    expect(total).toContain('$'); // Usa símbolo de USD
  });

  it('debería devolver el índice en trackByItems', () => {
    const index = component.trackByItems(5);
    expect(index).toBe(5);
  });

  it('debería suscribirse a actualizaciones del carrito en ngOnInit', () => {
    component.ngOnInit();
    cartUpdated$.next();
    expect(cartServiceMock.getItems).toHaveBeenCalled();
  });

  it('debería desuscribirse en ngOnDestroy', () => {
    component.ngOnInit();
    spyOn(component['cartSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['cartSubscription'].unsubscribe).toHaveBeenCalled();
  });
});




