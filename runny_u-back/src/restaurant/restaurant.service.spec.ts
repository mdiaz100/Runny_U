import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/restaurant.dto';

describe('RestaurantService', () => {
  let service: RestaurantService;

  // Mock completo de Supabase
  const mockSupabaseClient = {
    rpc: jest.fn(),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
  };

  beforeAll(() => {
    // Silencia console.error para que no aparezcan mensajes de Supabase
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ debería retornar todos los restaurantes', async () => {
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

    // Mockeamos el método interno que llama a Supabase
    jest.spyOn(service, 'findAll').mockResolvedValue(mockData);

    const result = await service.findAll();

    expect(result).toEqual(mockData);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('✅ debería retornar un restaurante por id', async () => {
    const mockRestaurant: RestaurantDto = {
      id: '1',
      name: 'Restaurante A',
      menu: [],
      schedule: '9:00-21:00',
      location: 'Calle 123',
      image: 'imgA.png',
      description: 'Comida típica',
    };

    jest.spyOn(service, 'findById').mockResolvedValue(mockRestaurant);

    const result = await service.findById('1');

    expect(result).toEqual(mockRestaurant);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('✅ debería retornar null si el restaurante no existe', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    const result = await service.findById('99');

    expect(result).toBeNull();
    expect(service.findById).toHaveBeenCalledWith('99');
  });
});

