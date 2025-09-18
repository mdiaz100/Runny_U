import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { PromotionService } from '../../shared/services/promotion.service';
import { AuthService } from '../../shared/services/auth.service';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Promotion } from '../../shared/interfaces/promotions.interface';
import { User } from '../../shared/interfaces/user.interface';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let restaurantServiceMock: any;
  let promotionServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Restaurante A',
        schedule: '8am - 10pm',
        location: 'Calle 1',
        image: 'rest1.png',
        description: 'Desc A',
        menu: [
          {
            category: 'Platos',
            items: [
              { id: 'm1', name: 'Arroz', price: 10, image: 'arroz.png', description: 'rico arroz' }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Restaurante B',
        schedule: '9am - 9pm',
        location: 'Calle 2',
        image: 'rest2.png',
        description: 'Desc B',
        menu: []
      }
    ];

    const mockPromotions: Promotion[] = [
      { badge: 'Nuevo', image: 'promo1.png', title: 'Promo 1', restaurant: 'Restaurante A', description: 'Desc 1', date: '2025-01-01', time: '12:00' },
      { badge: 'Hot', image: 'promo2.png', title: 'Promo 2', restaurant: 'Restaurante B', description: 'Desc 2', date: '2025-01-02', time: '13:00' }
    ];

    const mockUser: User = {
      fullname: 'Melisa',
      email: 'mel@soyudemedellin.edu.co',
      password: '123'
    };

    restaurantServiceMock = {
      getRestaurants: jasmine.createSpy('getRestaurants').and.returnValue(of(mockRestaurants))
    };

    promotionServiceMock = {
      getPromotions: jasmine.createSpy('getPromotions').and.returnValue(mockPromotions)
    };

    authServiceMock = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
      getLoggedInUser: jasmine.createSpy('getLoggedInUser').and.returnValue(mockUser)
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: RestaurantService, useValue: restaurantServiceMock },
        { provide: PromotionService, useValue: promotionServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar restaurantes en ngOnInit', () => {
    component.ngOnInit();
    expect(restaurantServiceMock.getRestaurants).toHaveBeenCalled();
    expect(component.restaurants.length).toBe(2);
    expect(component.restaurants[0].name).toBe('Restaurante A');
  });

  it('debería manejar error al cargar restaurantes', () => {
    spyOn(console, 'error'); 
    restaurantServiceMock.getRestaurants.and.returnValue(
      throwError(() => new Error('Error en API'))
    );

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      'Error cargando restaurantes',
      jasmine.any(Error)
    );
    expect(component.restaurants).toEqual([]); 
  });

  it('debería cargar promociones en ngOnInit', () => {
    component.ngOnInit();
    expect(promotionServiceMock.getPromotions).toHaveBeenCalled();
    expect(component.promotions.length).toBe(2);
    expect(component.promotions[0].title).toBe('Promo 1');
  });

  it('debería verificar si el usuario está logueado y asignar el user', () => {
    component.ngOnInit();
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(authServiceMock.getLoggedInUser).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.user?.fullname).toBe('Melisa');
  });
});

