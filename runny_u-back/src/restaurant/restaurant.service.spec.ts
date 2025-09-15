import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/restaurant.dto';

describe('RestaurantService', () => {
  let service: RestaurantService;

  const mockRpc = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: { rpc: mockRpc },
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);

    // Reemplaza el cliente real por nuestro mock
    (service as any).supabase = { rpc: mockRpc };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todos los restaurantes', async () => {
    const mockData: RestaurantDto[] = [
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

    mockRpc.mockResolvedValue({ data: mockData, error: null });

    const result = await service.findAll();

    expect(mockRpc).toHaveBeenCalledWith('get_restaurants_with_menu');
    expect(result).toEqual(mockData);
  });

  it('debería retornar un restaurante por id', async () => {
    const mockRestaurant: RestaurantDto = {
      id: '1',
      name: 'Restaurante A',
      menu: [],
      schedule: '9:00-21:00',
      location: 'Calle 123',
      image: 'imgA.png',
      description: 'Comida típica',
    };

    mockRpc.mockResolvedValue({ data: mockRestaurant, error: null });

    const result = await service.findById('1');

    expect(mockRpc).toHaveBeenCalledWith('get_restaurant_by_id', { p_restaurant_id: '1' });
    expect(result).toEqual(mockRestaurant);
  });

  it('debería retornar null si el restaurante no existe', async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const result = await service.findById('99');

    expect(result).toBeNull();
  });

  it('debería retornar [] si hay error en findAll', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'DB error' } });

    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('debería lanzar error si hay error en findById', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'No encontrado' } });

    await expect(service.findById('1')).rejects.toThrow('No encontrado');
  });
});


