import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../../interfaces/restaurant.interface';

describe('RestaurantService Patterns', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  const API_URL = 'http://localhost:3000/api/restaurants';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService],
    });

    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 🧹 Garantiza independencia (FIRST)
  });

  it('debería crearse el servicio (Dummy Test)', () => {
    // Arrange - nada que preparar
    // Act
    const instance = service;
    // Assert (Fluent assertion)
    expect(instance).withContext('El servicio debería existir').toBeTruthy();
  });

  it('debería obtener todos los restaurantes (Mock + Triple AAA)', () => {
    // Arrange
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

    // Act (Simulación del servicio con un Mock de HTTP)
    service.getRestaurants().subscribe((restaurants) => {
      // Assert - Fluent Assertions
      expect(restaurants).withContext('Debe retornar una lista').toBeTruthy();
      expect(restaurants.length).withContext('Debe contener dos restaurantes').toBe(2);
      expect(restaurants).toEqual(mockRestaurants);
      expect(restaurants[0].name).withContext('El primero debe ser Sr. Gourmet').toBe('Sr. Gourmet');
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).withContext('Debe usar método GET').toBe('GET');
    req.flush(mockRestaurants);
  });

  it('debería obtener un restaurante por ID (Stub)', () => {
    // Arrange
    const stubRestaurant: Restaurant = {
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

    // Act
    service.getRestaurantById('1').subscribe((restaurant) => {
      // Assert
      expect(restaurant).withContext('Debe retornar el restaurante solicitado').toBeTruthy();
      expect(restaurant.id).toBe('1');
      expect(restaurant.name).toBe('Sr. Gourmet');
      expect(restaurant.menu[0].items[0].name).toContain('Arroz');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(stubRestaurant);
  });

  it('debería manejar un error 404 al buscar restaurante inexistente (Fake + Spy)', () => {
    // Arrange
    const errorMsg = 'Restaurante no encontrado';
    const spyConsole = spyOn(console, 'error'); // Spy: observamos el comportamiento

    // Act
    service.getRestaurantById('999').subscribe({
      next: () => fail('Debería lanzar error'),
      error: (error) => {
        // Assert
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        expect(spyConsole).toHaveBeenCalled(); // Spy usado para confirmar log
      },
    });

    const req = httpMock.expectOne(`${API_URL}/999`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMsg, { status: 404, statusText: 'Not Found' });
  });
});
