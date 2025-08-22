import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { RestaurantService } from '../../shared/services/restaurant.service';


class MockRestaurantService {
  restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Test Restaurant',
      schedule: '9:00 - 18:00',
      location: 'Main Street',
      image: 'test.jpg',
      description: 'Restaurant de prueba',
      menu: [
        {
          category: 'Bebidas',
          items: [
            {
              id: 'c1',
              name: 'Café',
              price: 5000,
              image: 'cafe.jpg',
              description: 'Café caliente'
            }
          ]
        }
      ]
    }
  ];

  getRestaurantById(id: string) {
    return this.restaurants.find(r => r.id === id);
  }
}

describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;
  let mockService: MockRestaurantService;

  beforeEach(async () => {
    mockService = new MockRestaurantService();

    await TestBed.configureTestingModule({
      imports: [RestaurantComponent], 
      providers: [
        { provide: RestaurantService, useValue: mockService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener un restaurante con el id de la ruta en ngOnInit', () => {
    fixture.detectChanges();
    expect(component.restaurant).toBeTruthy();
    expect(component.restaurant?.id).toBe('1');
    expect(component.restaurant?.name).toBe('Test Restaurant');
  });

  it('no debería asignar restaurant si no hay id en la ruta', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

    component.ngOnInit(); 

    expect(component.restaurant).toBeUndefined();
  });
});



