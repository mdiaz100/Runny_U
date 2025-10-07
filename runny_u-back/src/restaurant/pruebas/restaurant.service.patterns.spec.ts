import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from '../restaurant.service';
import { RestaurantDto } from '../dto/restaurant.dto';


describe('RestaurantService', () => {
  let service: RestaurantService;
  let mockSupabaseClient: { rpc: jest.Mock };

  //  Arrange: crear el test double (mock) antes de cada prueba
  beforeEach(async () => {
    mockSupabaseClient = {
      rpc: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: mockSupabaseClient,
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    (service as any).supabase = mockSupabaseClient; // inyectar mock
  });

  afterEach(() => {
    jest.clearAllMocks(); // limpia mocks entre pruebas (FIRST: Repeatable)
  });

  //  Caso 1: obtener todos los restaurantes
  it(' debería retornar todos los restaurantes (findAll)', async () => {
    // Arrange
    const mockRestaurants: RestaurantDto[] = [
      {
        id: '1',
        name: 'Restaurante A',
        menu: [],
        schedule: '9:00-21:00',
        location: 'Calle 123',
        image: 'imgA.png',
        description: 'Comida típica',
      },
      {
        id: '2',
        name: 'Restaurante B',
        menu: [],
        schedule: '10:00-22:00',
        location: 'Avenida 456',
        image: 'imgB.png',
        description: 'Comida internacional',
      },
    ];

    mockSupabaseClient.rpc.mockResolvedValue({
      data: mockRestaurants,
      error: null,
    });

    // Act
    const result = await service.findAll();

    // Assert
    expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(1);
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_restaurants_with_menu');
    expect(result).toEqual(mockRestaurants);
  });

  //  Caso 2: obtener restaurante por ID
  it(' debería retornar un restaurante por id (findById)', async () => {
    // Arrange
    const restaurantId = '1';
    const mockRestaurant: RestaurantDto = {
      id: restaurantId,
      name: 'Restaurante A',
      menu: [],
      schedule: '9:00-21:00',
      location: 'Calle 123',
      image: 'imgA.png',
      description: 'Comida típica',
    };

    mockSupabaseClient.rpc.mockResolvedValue({
      data: mockRestaurant,
      error: null,
    });

    // Act
    const result = await service.findById(restaurantId);

    // Assert
    expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(1);
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('get_restaurant_by_id', {
      p_restaurant_id: restaurantId,
    });
    expect(result).toEqual(mockRestaurant);
  });

  // 🧪 Caso 3: restaurante no encontrado
  it(' debería retornar null si el restaurante no existe', async () => {
    // Arrange
    mockSupabaseClient.rpc.mockResolvedValue({
      data: null,
      error: null,
    });

    // Act
    const result = await service.findById('99');

    // Assert
    expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  //  Caso 4: error en findAll
  it(' debería retornar [] si ocurre un error en findAll', async () => {
    // Arrange
    mockSupabaseClient.rpc.mockResolvedValue({
      data: null,
      error: { message: 'DB error' },
    });

    // Act
    const result = await service.findAll();

    // Assert
    expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  //  Caso 5: error en findById
  it(' debería lanzar error si hay error en findById', async () => {
    // Arrange
    const restaurantId = '1';
    mockSupabaseClient.rpc.mockResolvedValue({
      data: null,
      error: { message: 'No encontrado' },
    });

    // Act & Assert
    await expect(service.findById(restaurantId)).rejects.toThrow('No encontrado');
    expect(mockSupabaseClient.rpc).toHaveBeenCalledTimes(1);
  });
});
