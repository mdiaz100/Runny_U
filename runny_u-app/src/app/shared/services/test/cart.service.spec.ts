import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartItem } from '../../interfaces/cart-item.interface';
import { CartService } from '../cart.service';


describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const mockItem: CartItem = { 
    id: '1',
    name: 'Producto 1', 
    price: 100, 
    image: 'imagen1.jpg',
    quantity: 1 
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería estar creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un item nuevo al carrito', (done) => {
    service.cartUpdated$.subscribe(() => {
      expect(service.getItems().length).toBe(1);
      expect(service.getItems()[0].quantity).toBe(1);
      done();
    });
    service.addItem(mockItem);
  });

  it('debería incrementar la cantidad si el item ya existe', () => {
    service.addItem(mockItem);
    service.addItem(mockItem);
    const items = service.getItems();
    expect(items[0].quantity).toBe(2);
  });

  it('debería actualizar la cantidad de un item', () => {
    service.addItem(mockItem);
    service.updateItemQuantity(mockItem, 5);
    expect(service.getItems()[0].quantity).toBe(5);
  });

  it('debería eliminar un item del carrito', () => {
    service.addItem(mockItem);
    service.removeItem(mockItem);
    expect(service.getItems().length).toBe(0);
  });

  it('debería vaciar el carrito', () => {
    service.addItem(mockItem);
    service.addItem({ id: '2', name: 'Producto 2', price: 200, image: 'imagen2.jpg', quantity: 1 });
    service.clearCart();
    expect(service.getItems().length).toBe(0);
  });

  it('debería calcular el total correctamente', () => {
    service.addItem(mockItem); // 100
    service.addItem({ id: '2', name: 'Producto 2', price: 50, image: 'imagen2.jpg', quantity: 1 }); // 50
    expect(service.getTotal()).toBe(150);
  });

  it('debería emitir el número total de items', (done) => {
    service.totalItems$.subscribe((total) => {
      if (total === 2) {
        expect(total).toBe(2);
        done();
      }
    });
    service.addItem(mockItem);
    service.addItem({ id: '2', name: 'Producto 2', price: 50, image: 'imagen2.jpg', quantity: 1 });
  });

  it('debería crear un carrito vía API', () => {
    const mockCart = { id: '1', items: [mockItem] };

    service.createCart(mockCart).subscribe((res) => {
      expect(res).toEqual(mockCart);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/cart/create');
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });

  it('debería pagar un carrito vía API', () => {
    const cartId = '123';
    const mockResponse = { success: true };

    service.payCart(cartId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/v1/cart/pay/${cartId}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});

