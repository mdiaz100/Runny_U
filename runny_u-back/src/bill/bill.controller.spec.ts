import { Test, TestingModule } from '@nestjs/testing';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';

describe('BillController', () => {
  let controller: BillController;
  let service: BillService;

  const mockBillService = {
    getBillsByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillController],
      providers: [
        {
          provide: BillService,
          useValue: mockBillService,
        },
      ],
    }).compile();

    controller = module.get<BillController>(BillController);
    service = module.get<BillService>(BillService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBillsByUser', () => {
    it('debería retornar las facturas del usuario', async () => {
      const userId = 'user1';
      const mockResponse = [
        {
          numberBill: 1001,
          items: [{ id: 'item1', name: 'Producto 1', price: 100 }],
          total: 500,
        },
      ];

      mockBillService.getBillsByUser.mockResolvedValue(mockResponse);

      const result = await controller.getBillsByUser(userId);

      expect(service.getBillsByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResponse);
    });
  });
});
