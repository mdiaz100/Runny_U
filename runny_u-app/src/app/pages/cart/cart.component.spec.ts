import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let authServiceMock: any;
  let cartServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getUser: jasmine.createSpy('getUser').and.returnValue({ id: '123' }) 
    };

    cartServiceMock = {
      createCart: jasmine.createSpy('createCart')
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
    expect(component.cartId).toEqual(jasmine.any(String));
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
    expect(component.isCartSaved).toBeFalsy();
    expect(component.cartId).toBeFalsy(); 
  });
});



