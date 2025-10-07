import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import { CartService } from '../cart.service';
import { Cart } from '../entities/cart.entity';
import { Bill } from 'src/bill/entities/bill.entity';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from '../dto/cart-item.dto';

/**
 * Pruebas unitarias para CartService
 * - Patrón AAA: Arrange / Act / Assert
 * - Principios FIRST:
 *   F → Fast        (rápidas)
 *   I → Independent (independientes)
 *   R → Repeatable  (repetibles)
 *   S → Self-validating (auto-validantes)
 *   T → Timely      (oportunas)
 * - Uso de Test Doubles y Mocks de Jest
 */
describe('CartService', () => {
  let service: CartService;
  let mockCartRepo: jest.Mocked<Repository<Cart>>;
  let mockBillRepo: jest.Mocked<Repository<Bill>>;

  /**
   * Arrange global:
   * - Se inyectan los repositorios simulados (mocks)
   * - Se reemplaza el acceso real a la base de datos
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Bill),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    mockCartRepo = module.get(getRepositoryToken(Cart));
    mockBillRepo = module.get(getRepositoryToken(Bill));
  });

  afterEach(() => jest.clearAllMocks());

  // ==================================================
  // Crear carrito
  // ==================================================
  it('debería crear un carrito con total calculado correctamente', async () => {
    //  Arrange
    const user: User = { id: '1', email: 'test@test.com', password: 'hashed', fullname: 'Test User' } as User;

    const cartItems: CartItem[] = [
      { productId: 'p1', name: 'Producto A', price: 100, quantity: 2, image: 'a.png' },
      { productId: 'p2', name: 'Producto B', price: 50, quantity: 3, image: 'b.png' },
    ];

    const expectedCart: Partial<Cart> = {
      id: '1',
      user,
      cartItems,
      total: 350,
    };

    mockCartRepo.create.mockReturnValue(expectedCart as Cart);
    mockCartRepo.save.mockResolvedValue(expectedCart as Cart);

    //  Act
    const result = await service.createCart(user, cartItems);

    //  Assert
    expect(mockCartRepo.create).toHaveBeenCalledWith({
      user,
      cartItems,
      total: 350,
    });
    expect(mockCartRepo.save).toHaveBeenCalledWith(expectedCart);
    expect(result).toEqual(expectedCart);
  });

  // ==================================================
  //  Obtener carritos del usuario
  // ==================================================
  it('debería retornar los carritos de un usuario con su bill asociado', async () => {
    //  Arrange
    const userId = '1';
    const mockCarts: Partial<Cart>[] = [
      { id: 'c1', user: { id: userId } as User, total: 100, bill: { id: 'b1' } as Bill },
      { id: 'c2', user: { id: userId } as User, total: 200, bill: { id: 'b2' } as Bill },
    ];

    mockCartRepo.find.mockResolvedValue(mockCarts as Cart[]);

    //  Act
    const result = await service.getUserCarts(userId);

    //  Assert
    expect(mockCartRepo.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      relations: ['bill'],
    });
    expect(result).toEqual(mockCarts);
  });

  // ==================================================
  //  Buscar carrito por ID
  // ==================================================
  it(' debería retornar un carrito por id', async () => {
    //  Arrange
    const mockCart: Partial<Cart> = { id: 'c1', cartItems: [], user: { id: '1' } as User };
    mockCartRepo.findOne.mockResolvedValue(mockCart as Cart);

    //  Act
    const result = await service.getCartById('c1');

    //  Assert
    expect(mockCartRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'c1' },
      relations: ['bill', 'user'],
    });
    expect(result).toEqual(mockCart);
  });

  it(' debería lanzar NotFoundException si el carrito no existe', async () => {
    //  Arrange
    mockCartRepo.findOne.mockResolvedValue(null);

    //  Act + Assert
    await expect(service.getCartById('c99')).rejects.toThrow(NotFoundException);
  });

  // ==================================================
  //  Actualizar carrito
  // ==================================================
  it(' debería actualizar un carrito correctamente', async () => {
    //  Arrange
    const cartId = 'c1';
    const existingCart: Cart = {
        id: cartId,
        cartItems: [],
        user: { id: '1' } as User,
        total: 0,
    } as unknown as Cart;

    const updateDto = {
      cartItem: [{ productId: 'p1', name: 'Producto A', price: 100, quantity: 2, image: 'a.png' }],
    };

    mockCartRepo.findOne.mockResolvedValue(existingCart);
    mockCartRepo.save.mockResolvedValue(existingCart);

    //  Act
    const result = await service.updateCart(cartId, updateDto);

    //  Assert
    expect(result.total).toBe(200);
    expect(mockCartRepo.save).toHaveBeenCalledWith({
      ...existingCart,
      cartItems: updateDto.cartItem,
      total: 200,
    });
  });

  it('debería lanzar error si no se pasan cartItems en updateCart', async () => {
    //  Arrange
    const cartId = 'c1';
    const existingCart: Cart = { id: cartId, cartItems: [], total: 0 } as unknown as Cart;
    mockCartRepo.findOne.mockResolvedValue(existingCart);

    const updateDto = { cartItem: null };

    //  Act + Assert
    await expect(service.updateCart(cartId, updateDto as any)).rejects.toThrow(
      'Cart items must be provided as an array.',
    );
  });

  // ==================================================
  //  Eliminar carrito
  // ==================================================
  it(' debería eliminar un carrito', async () => {
    //  Arrange
    mockCartRepo.delete.mockResolvedValue({ affected: 1 } as any);

    // Act
    await service.deleteCart('c1');

    //  Assert
    expect(mockCartRepo.delete).toHaveBeenCalledWith('c1');
  });

  // ==================================================
  // Pagar carrito → Generar factura
  // ==================================================
  it(' debería pagar un carrito generando una factura nueva', async () => {
    //  Arrange
    const cartId = 'c1';
    const cart: Partial<Cart> = {
      id: cartId,
      cartItems: [{ productId: 'p1', name: 'Producto A', price: 100, quantity: 2, image: 'a.png' }],
    };

    const lastBill: Partial<Bill>[] = [{ id: 'b1', numberBill: 5 }];
    const newBill: Partial<Bill> = { id: 'b2', numberBill: 6, total: 200, cart: cart as Cart };

    mockCartRepo.findOne.mockResolvedValue(cart as Cart);
    mockBillRepo.find.mockResolvedValue(lastBill as Bill[]);
    mockBillRepo.create.mockReturnValue(newBill as Bill);
    mockBillRepo.save.mockResolvedValue(newBill as Bill);

    //  Act
    const result = await service.payCart(cartId);

    // Assert
    expect(mockCartRepo.findOne).toHaveBeenCalledWith({
      where: { id: cartId },
      relations: ['bill'],
    });
    expect(mockBillRepo.find).toHaveBeenCalledWith({ order: { numberBill: 'DESC' }, take: 1 });
    expect(mockBillRepo.create).toHaveBeenCalledWith({
      numberBill: 6,
      total: 200,
      cart,
    });
    expect(mockBillRepo.save).toHaveBeenCalledWith(newBill);
    expect(result).toEqual(newBill);
  });

  it(' debería lanzar NotFoundException si no se encuentra el carrito al pagar', async () => {
    //  Arrange
    mockCartRepo.findOne.mockResolvedValue(null);

    //  Act + Assert
    await expect(service.payCart('c99')).rejects.toThrow(NotFoundException);
  });
});

