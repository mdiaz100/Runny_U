import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/restaurant.dto';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: jest.Mocked<RestaurantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get(RestaurantService);
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

    service.findAll.mockResolvedValue(mockData);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockData);
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

    service.findById.mockResolvedValue(mockRestaurant);

    const result = await controller.findOne('1');

    expect(service.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockRestaurant);
  });

  it('✅ debería retornar null si el restaurante no existe', async () => {
    service.findById.mockResolvedValue(null);

    const result = await controller.findOne('99');

    expect(service.findById).toHaveBeenCalledWith('99');
    expect(result).toBeNull();
  });
});

