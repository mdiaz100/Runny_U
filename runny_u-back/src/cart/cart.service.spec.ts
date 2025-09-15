import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CartItem } from './dto/cart-item.dto';
import { Bill } from '../bill/entities/bill.entity';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: jest.Mocked<Repository<Cart>>;
  let billRepository: jest.Mocked<Repository<Bill>>;

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
    cartRepository = module.get(getRepositoryToken(Cart));
    billRepository = module.get(getRepositoryToken(Bill));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear un carrito con total calculado correctamente', async () => {
    const user: User = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed',
      fullname: 'Test User',
    } as User;

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

    cartRepository.create.mockReturnValue(expectedCart as Cart);
    cartRepository.save.mockResolvedValue(expectedCart as Cart);

    const result = await service.createCart(user, cartItems);

    expect(cartRepository.create).toHaveBeenCalledWith({
      user,
      cartItems,
      total: 350,
    });
    expect(cartRepository.save).toHaveBeenCalledWith(expectedCart);
    expect(result).toEqual(expectedCart);
  });

  it('debería retornar los carritos de un usuario con su bill asociado', async () => {
    const userId = '1';

    const mockCarts: Partial<Cart>[] = [
      { id: 'c1', user: { id: userId } as User, cartItems: [], total: 100, bill: { id: 'b1' } as Bill },
      { id: 'c2', user: { id: userId } as User, cartItems: [], total: 200, bill: { id: 'b2' } as Bill },
    ];

    cartRepository.find.mockResolvedValue(mockCarts as Cart[]);

    const result = await service.getUserCarts(userId);

    expect(cartRepository.find).toHaveBeenCalledWith({
      where: { user: { id: userId } },
      relations: ['bill'],
    });
    expect(result).toEqual(mockCarts);
  });

  it('debería retornar un carrito por id', async () => {
    const mockCart: Partial<Cart> = { id: 'c1', cartItems: [], user: { id: '1' } as User };
    cartRepository.findOne.mockResolvedValue(mockCart as Cart);

    const result = await service.getCartById('c1');

    expect(cartRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'c1' },
      relations: ['bill', 'user'],
    });
    expect(result).toEqual(mockCart);
  });

  it('debería lanzar NotFoundException si el carrito no existe al buscar por id', async () => {
    cartRepository.findOne.mockResolvedValue(null);

    await expect(service.getCartById('c99')).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar un carrito correctamente', async () => {
    const cartId = 'c1';
    const existingCart: Cart = {
      id: cartId,
      cartItems: [],
      user: { id: '1' } as User,
      total: 0,
    } as unknown as Cart;;

    cartRepository.findOne.mockResolvedValue(existingCart);
    cartRepository.save.mockResolvedValue(existingCart);

    const updateDto = {
      cartItem: [{ productId: 'p1', name: 'Producto A', price: 100, quantity: 2, image: 'a.png' }],
    };

    const result = await service.updateCart(cartId, updateDto);

    expect(result.total).toBe(200);
    expect(cartRepository.save).toHaveBeenCalledWith({
      ...existingCart,
      cartItems: updateDto.cartItem,
      total: 200,
    });
  });

  it('debería lanzar error si no se pasan cartItems en updateCart', async () => {
    const cartId = 'c1';
    const existingCart: Cart = { id: cartId, cartItems: [], total: 0 } as unknown as Cart;;
    cartRepository.findOne.mockResolvedValue(existingCart);

    const updateDto = { cartItem: null };

    await expect(service.updateCart(cartId, updateDto as any)).rejects.toThrow(
      'Cart items must be provided as an array.',
    );
  });

  it('debería eliminar un carrito', async () => {
    cartRepository.delete.mockResolvedValue({ affected: 1 } as any);

    await service.deleteCart('c1');

    expect(cartRepository.delete).toHaveBeenCalledWith('c1');
  });

  it('debería pagar un carrito generando una factura nueva', async () => {
    const cartId = 'c1';
    const cart: Partial<Cart> = {
      id: cartId,
      cartItems: [{ productId: 'p1', name: 'Producto A', price: 100, quantity: 2, image: 'a.png' }],
    };

    const lastBill: Partial<Bill>[] = [{ id: 'b1', numberBill: 5 }];

    const newBill: Partial<Bill> = { id: 'b2', numberBill: 6, total: 200, cart: cart as Cart };

    cartRepository.findOne.mockResolvedValue(cart as Cart);
    billRepository.find.mockResolvedValue(lastBill as Bill[]);
    billRepository.create.mockReturnValue(newBill as Bill);
    billRepository.save.mockResolvedValue(newBill as Bill);

    const result = await service.payCart(cartId);

    expect(cartRepository.findOne).toHaveBeenCalledWith({
      where: { id: cartId },
      relations: ['bill'],
    });
    expect(billRepository.find).toHaveBeenCalledWith({ order: { numberBill: 'DESC' }, take: 1 });
    expect(billRepository.create).toHaveBeenCalledWith({
      numberBill: 6,
      total: 200,
      cart,
    });
    expect(billRepository.save).toHaveBeenCalledWith(newBill);
    expect(result).toEqual(newBill);
  });

  it('debería lanzar NotFoundException si no se encuentra el carrito al pagar', async () => {
    cartRepository.findOne.mockResolvedValue(null);

    await expect(service.payCart('c99')).rejects.toThrow(NotFoundException);
  });
});



