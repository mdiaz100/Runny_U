import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartItem } from '../../interfaces/cart-item.interface';
import { CartService } from '../cart.service';

describe('CartService Patterns', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  // Dummy Object: dato sin lógica, solo para cumplir la estructura
  const dummyItem: CartItem = {
    id: '1',
    name: 'Producto 1',
    price: 100,
    image: 'imagen1.jpg',
    quantity: 1,
  };

  beforeEach(() => {
    // Arrange (Setup)
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

  //  1. Verificación básica de creación
  it('debería crearse correctamente (FIRST)', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  // 2. Agregar un nuevo ítem
  it('debería agregar un nuevo item al carrito (AAA + Fluent)', (done) => {
    // Arrange
    const expectedCount = 1;

    // Act
    service.cartUpdated$.subscribe(() => {
      const items = service.getItems();

      // Assert (Fluent)
      expect(Array.isArray(items)).toBeTrue();
      expect(items.length).toBe(expectedCount);
      expect(items[0].quantity).toBe(1);
      done();
    });

    service.addItem(dummyItem);
  });

  //  3. Incrementar cantidad si ya existe (Stub + AAA)
  it('debería incrementar cantidad si el item ya existe', () => {
    // Arrange
    service.addItem(dummyItem);

    // Act
    service.addItem(dummyItem);

    // Assert
    const items = service.getItems();
    expect(items[0].quantity).toBe(2);
  });

  //  4. Actualizar cantidad (Mock de comportamiento interno)
  it('debería actualizar la cantidad de un item', () => {
    // Arrange
    service.addItem(dummyItem);

    // Act
    service.updateItemQuantity(dummyItem, 5);

    // Assert
    const updated = service.getItems()[0];
    expect(updated.quantity).toBe(5);
  });

  //  5. Eliminar item (Spy: observamos comportamiento del método)
  it('debería eliminar un item del carrito', () => {
    // Arrange
    service.addItem(dummyItem);
    const spy = spyOn(service, 'removeItem').and.callThrough();

    // Act
    service.removeItem(dummyItem);

    // Assert
    expect(spy).toHaveBeenCalledOnceWith(dummyItem);
    expect(service.getItems().length).toBe(0);
  });

  //  6. Vaciar carrito (Fake)
  it('debería vaciar el carrito (Fake)', () => {
    // Arrange
    service.addItem(dummyItem);
    service.addItem({
      id: '2',
      name: 'Producto 2',
      price: 200,
      image: 'imagen2.jpg',
      quantity: 1,
    });

    // Act
    service.clearCart();

    // Assert
    expect(service.getItems()).toEqual([]);
  });

  //  7. Calcular total (Fluent Assertion)
  it('debería calcular el total correctamente', () => {
    // Arrange
    service.addItem(dummyItem); // 100
    service.addItem({ id: '2', name: 'Producto 2', price: 50, image: 'imagen2.jpg', quantity: 1 }); // 50

    // Act
    const total = service.getTotal();

    // Assert
    expect(total).toBe(150);
    expect(total).toBeGreaterThan(0);
  });

  //  8. Emitir número total de ítems (Spy + Observable)
  it('debería emitir el número total de ítems', (done) => {
    // Arrange
    const expectedTotal = 2;

    // Act
    service.totalItems$.subscribe((total) => {
      if (total === expectedTotal) {
        // Assert
        expect(total).toBe(expectedTotal);
        done();
      }
    });

    service.addItem(dummyItem);
    service.addItem({ id: '2', name: 'Producto 2', price: 50, image: 'imagen2.jpg', quantity: 1 });
  });

  //  9. Crear carrito vía API (Mock de HTTP)
  it('debería crear un carrito vía API', () => {
    // Arrange
    const mockCart = { id: '1', items: [dummyItem] };

    // Act
    service.createCart(mockCart).subscribe((res) => {
      // Assert
      expect(res).toEqual(mockCart);
      expect(res.items.length).toBe(1);
    });

    // HTTP Mock
    const req = httpMock.expectOne('http://localhost:3000/api/v1/cart/create');
    expect(req.request.method).toBe('POST');
    req.flush(mockCart);
  });

  //  10. Pagar carrito vía API (Mock)
  it('debería pagar un carrito vía API', () => {
    // Arrange
    const cartId = '123';
    const mockResponse = { success: true };

    // Act
    service.payCart(cartId).subscribe((res) => {
      // Assert
      expect(res.success).toBeTrue();
    });

    // Mock HTTP request
    const req = httpMock.expectOne(`http://localhost:3000/api/v1/cart/pay/${cartId}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
