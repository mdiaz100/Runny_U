import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantComponent } from './restaurant.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';

describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;
  let restaurantServiceMock: any;
  let cartServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  const restaurantMock: Restaurant = {
    id: '1',
    name: 'Restaurante Prueba',
    schedule: '9:00 - 18:00',
    location: 'Medellín',
    image: 'image.png',
    description: 'Un restaurante de prueba',
    menu: [
      {
        category: 'Entradas',
        items: [
          {
            id: 'item1',
            name: 'Arepa',
            price: 5000,
            image: 'arepa.png',
            description: 'Arepa con queso'
          }
        ]
      }
    ]
  };

  beforeEach(async () => {
    restaurantServiceMock = {
      getRestaurantById: jasmine.createSpy('getRestaurantById').and.returnValue(of(restaurantMock))
    };

    cartServiceMock = {
      addItem: jasmine.createSpy('addItem'),
      getItems: jasmine.createSpy('getItems').and.returnValue([]),
      getTotal: jasmine.createSpy('getTotal').and.returnValue(0)
    };

    authServiceMock = {
      isLoggedIn: jasmine.createSpy('isLoggedIn')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false
      } as SweetAlertResult<any>)
    );

    await TestBed.configureTestingModule({
      imports: [RestaurantComponent],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
  });

  it('debería cargar restaurante en ngOnInit', () => {
    component.ngOnInit();
    expect(restaurantServiceMock.getRestaurantById).toHaveBeenCalledWith('1');
    expect(component.restaurant).toEqual(restaurantMock);
  });

  it('debería añadir item al carrito si el usuario está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const item = { id: 'item1', name: 'Arepa', price: 5000, image: 'arepa.png' };
    component.onAddToCart(item);

    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(cartServiceMock.addItem).toHaveBeenCalledWith({ ...item, quantity: 1 });
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería mostrar alerta y redirigir a login si el usuario NO está logueado', async () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const item = { id: 'item1', name: 'Arepa', price: 5000, image: 'arepa.png' };
    await component.onAddToCart(item);

    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(cartServiceMock.addItem).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para añadir productos al carrito',
      icon: 'info'
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
