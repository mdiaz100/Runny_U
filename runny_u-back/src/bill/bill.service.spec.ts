import { Test, TestingModule } from '@nestjs/testing';
import { BillService } from './bill.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';

describe('BillService', () => {
  let service: BillService;
  let billRepository: jest.Mocked<Repository<Bill>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: getRepositoryToken(Bill),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
    billRepository = module.get(getRepositoryToken(Bill));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBillsByUser', () => {
    it('✅ debería devolver las facturas transformadas correctamente', async () => {
      const mockBills: Bill[] = [
        {
          id: '1',
          numberBill: 1001,
          total: 500,
          cart: {
            id: 'cart1',
            cartItems: [{ id: 'item1', name: 'Producto 1', price: 100 }],
            user: { id: 'user1' },
          },
        } as any,
        {
          id: '2',
          numberBill: 1002,
          total: 300,
          cart: {
            id: 'cart2',
            cartItems: [{ id: 'item2', name: 'Producto 2', price: 300 }],
            user: { id: 'user1' },
          },
        } as any,
      ];

      billRepository.find.mockResolvedValue(mockBills);

      const result = await service.getBillsByUser('user1');

      expect(billRepository.find).toHaveBeenCalledWith({
        relations: ['cart', 'cart.user'],
        where: { cart: { user: { id: 'user1' } } },
      });

      expect(result).toEqual([
        {
          numberBill: 1001,
          items: [{ id: 'item1', name: 'Producto 1', price: 100 }],
          total: 500,
        },
        {
          numberBill: 1002,
          items: [{ id: 'item2', name: 'Producto 2', price: 300 }],
          total: 300,
        },
      ]);
    });

    it('✅ debería devolver un array vacío si no hay facturas', async () => {
      billRepository.find.mockResolvedValue([]);

      const result = await service.getBillsByUser('user1');

      expect(billRepository.find).toHaveBeenCalledWith({
        relations: ['cart', 'cart.user'],
        where: { cart: { user: { id: 'user1' } } },
      });

      expect(result).toEqual([]);
    });
  });
});
