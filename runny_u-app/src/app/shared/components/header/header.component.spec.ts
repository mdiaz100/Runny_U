import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { of, Subject, throwError } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RestaurantService } from '../../services/restaurant.service';
import { BillService } from '../../services/bill.service';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';


class MockAuthService {
  user$ = of({ id: '123', fullname: 'Test User', email: 'test@soyudemedellin.edu.co' });
  logout = jasmine.createSpy('logout');
}

class MockCartService {
  totalItems$ = of(3);
  clearCart = jasmine.createSpy('clearCart');
}

class MockRestaurantService {
  getRestaurants = jasmine
    .createSpy('getRestaurants')
    .and.returnValue(
      of([
        {
          id: '1',
          name: 'Restaurante Test',
          schedule: '',
          location: '',
          image: '',
          menu: [],
          description: '',
        },
      ])
    );
}

class MockBillService {
  getBillsByUser = jasmine
    .createSpy('getBillsByUser')
    .and.returnValue(of([{ id: 'b1', total: 10000 }]));
}

class MockRouter {
  url = '/';
  events = new Subject();
  navigate = jasmine.createSpy('navigate');
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let cartService: MockCartService;
  let restaurantService: MockRestaurantService;
  let billService: MockBillService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CartService, useClass: MockCartService },
        { provide: RestaurantService, useClass: MockRestaurantService },
        { provide: BillService, useClass: MockBillService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as any;
    cartService = TestBed.inject(CartService) as any;
    restaurantService = TestBed.inject(RestaurantService) as any;
    billService = TestBed.inject(BillService) as any;
    router = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con usuario logueado y restaurantes cargados', () => {
    expect(component.isLoggedIn).toBeTrue();
    expect(component.user).toEqual(
      jasmine.objectContaining({ email: 'test@soyudemedellin.edu.co' })
    );
    expect(component.restaurants.length).toBeGreaterThan(0);
    expect(component.totalItems).toBe(3);
  });

  it('debería actualizar el estado de la ruta cuando cambia la URL', () => {
    router.events.next(new NavigationEnd(1, '/restaurant/1', '/restaurant/1'));
    expect(component.isRestaurantDetailRoute).toBeTrue();
  });

  it('debería cerrar sesión correctamente', () => {
    spyOn(Swal, 'fire');
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Sesión cerrada' })
    );
  });

  it('debería abrir y cerrar el modal de perfil', () => {
    component.onOpenProfileModal();
    expect(component.showProfileModal).toBeTrue();
    component.onCloseProfileModal();
    expect(component.showProfileModal).toBeFalse();
  });

  it('debería realizar búsqueda de restaurantes', () => {
    component.allRestaurants = [
      {
        id: '1',
        name: 'Pizza Roma',
        schedule: '',
        location: '',
        image: '',
        menu: [],
        description: '',
      },
      {
        id: '2',
        name: 'Hamburguesas Locas',
        schedule: '',
        location: '',
        image: '',
        menu: [],
        description: '',
      },
    ];
    component.searchTerm = 'pizza';
    component.onSearch(new Event('submit'));
    expect(component.filteredRestaurants.length).toBe(1);
    expect(component.filteredRestaurants[0].name).toContain('Pizza');
    expect(component.showSearchResults).toBeTrue();
  });

  it('debería cerrar los resultados de búsqueda', () => {
    component.showSearchResults = true;
    component.onCloseSearchResults();
    expect(component.showSearchResults).toBeFalse();
  });

  it('debería abrir el modal de pedidos si el usuario es válido', () => {
    component.user = {
      id: '123',
      fullname: 'Test User',
      email: 'test@soyudemedellin.edu.co',
      iat: 1699999999, 
      exp: 1700009999, 
    } as JwtPayload;

    component.openBillsModal();
    expect(billService.getBillsByUser).toHaveBeenCalledWith('123');
    expect(component.showBillsModal).toBeTrue();
    expect(component.userBills.length).toBeGreaterThan(0);
  });

  it('debería mostrar error si el usuario no es válido al abrir pedidos', () => {
    spyOn(Swal, 'fire');
    component.user = null;
    component.openBillsModal();
    expect(Swal.fire).toHaveBeenCalledWith(
      'Error',
      'Usuario no válido',
      'error'
    );
  });

  it('debería cerrar el modal de pedidos', () => {
    component.showBillsModal = true;
    component.closeBillsModal();
    expect(component.showBillsModal).toBeFalse();
  });
});
