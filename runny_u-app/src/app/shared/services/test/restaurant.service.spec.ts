import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../../interfaces/restaurant.interface';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService],
    });

    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los restaurantes', () => {
    const mockRestaurants: Restaurant[] = [
      {
        id: '1',
        name: 'Sr. Gourmet',
        schedule: 'Lunes a Viernes 11:30 - 15:00',
        location: 'Calle 123',
        image: '/img/srgourmet.jpg',
        description: 'Comida variada y saludable',
        menu: [
          {
            category: 'Almuerzos',
            items: [
              { id: 'a1', name: 'Arroz con pollo', price: 12000, image: '/img/arrozpollo.jpg', description: 'Plato casero' },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Dogger',
        schedule: 'Todos los días 10:00 - 22:00',
        location: 'Calle 456',
        image: '/img/dogger.jpg',
        description: 'Hot dogs y hamburguesas',
        menu: [
          {
            category: 'Perros',
            items: [
              { id: 'b1', name: 'Perro Especial', price: 10000, image: '/img/perro.jpg', description: 'Con todo' },
            ],
          },
        ],
      },
    ];

    service.getRestaurants().subscribe((restaurants) => {
      expect(restaurants.length).toBe(2);
      expect(restaurants).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/restaurants');
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants); // Simula la respuesta del backend
  });

  it('debería obtener un restaurante por id', () => {
    const mockRestaurant: Restaurant = {
      id: '1',
      name: 'Sr. Gourmet',
      schedule: 'Lunes a Viernes 11:30 - 15:00',
      location: 'Calle 123',
      image: '/img/srgourmet.jpg',
      description: 'Comida variada y saludable',
      menu: [
        {
          category: 'Almuerzos',
          items: [
            { id: 'a1', name: 'Arroz con pollo', price: 12000, image: '/img/arrozpollo.jpg', description: 'Plato casero' },
          ],
        },
      ],
    };

    service.getRestaurantById('1').subscribe((restaurant) => {
      expect(restaurant).toEqual(mockRestaurant);
      expect(restaurant.name).toBe('Sr. Gourmet');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/restaurants/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurant);
  });
});
