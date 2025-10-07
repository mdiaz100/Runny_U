import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillService } from '../bill.service';
import { Bill } from '../entities/bill.entity';


/**
 * Pruebas unitarias de BillService aplicando:
 * - Patrón AAA: Arrange / Act / Assert
 * - Principios FIRST:
 *    F → Fast (rápidas)
 *    I → Independent (independientes entre sí)
 *    R → Repeatable (repetibles)
 *    S → Self-validating (auto-verificables con asserts)
 *    T → Timely (escritas junto al desarrollo del código)
 * - Test Doubles:
 *    Se usa un Mock Repository como sustituto del repositorio real
 */
describe('BillService', () => {
  let service: BillService;
  let mockRepository: jest.Mocked<Repository<Bill>>;

  /**
   * Configuración antes de cada prueba
   * - Se crea un módulo de prueba de NestJS
   * - Se inyecta un mock del repositorio TypeORM
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          // Test Double: simulamos el repositorio real con un Mock
          provide: getRepositoryToken(Bill),
          useValue: {
            find: jest.fn(), // método mockeado
          },
        },
      ],
    }).compile();

    service = module.get<BillService>(BillService);
    mockRepository = module.get(getRepositoryToken(Bill));
  });

  /**
   *  Limpieza de mocks después de cada prueba
   * Asegura independencia (FIRST - I)
   */
  afterEach(() => jest.clearAllMocks());

  // ==================================================
  // Grupo de pruebas: getBillsByUser()
  // ==================================================
  describe('getBillsByUser', () => {
    it('debería devolver las facturas transformadas correctamente', async () => {
      // Arrange: Preparamos datos y comportamiento del mock
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

      // Mock: simulamos el resultado de la base de datos
      mockRepository.find.mockResolvedValue(mockBills);

      // Act: ejecutamos el método bajo prueba
      const result = await service.getBillsByUser('user1');

      // Assert: verificamos comportamiento y resultado
      // Verifica que se haya llamado correctamente al mock
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['cart', 'cart.user'],
        where: { cart: { user: { id: 'user1' } } },
      });

      // Verifica que el resultado esté correctamente transformado
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

    it('debería devolver un array vacío si no hay facturas', async () => {
      // Arrange: definimos comportamiento del mock sin datos
      mockRepository.find.mockResolvedValue([]);

      // Act: ejecutamos el método con usuario sin facturas
      const result = await service.getBillsByUser('user1');

      // Assert: validamos la llamada y la salida
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['cart', 'cart.user'],
        where: { cart: { user: { id: 'user1' } } },
      });

      // El método debe retornar un array vacío
      expect(result).toEqual([]);
    });
  });
});


