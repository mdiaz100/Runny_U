import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Bill } from '../bill/entities/bill.entity';

describe('CartController', () => {
  let controller: CartController;
  let service: jest.Mocked<CartService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            createCart: jest.fn(),
            getUserCarts: jest.fn(),
            getCartById: jest.fn(),
            updateCart: jest.fn(),
            deleteCart: jest.fn(),
            payCart: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get(CartService);
  });

  it('debería crear un carrito', async () => {
    const mockUser = { id: '1', email: 'u@test.com' } as User;
    const mockCart = {
      id: 'c1',
      user: mockUser,
      cartItems: [],
      total: 100,
    } as Partial<Cart> as Cart;

    service.createCart.mockResolvedValue(mockCart);

    const result = await controller.create(mockCart);

    expect(service.createCart).toHaveBeenCalledWith(mockUser, []);
    expect(result).toEqual(mockCart);
  });

  it('debería obtener los carritos de un usuario', async () => {
    const userId = '1';
    const mockCarts = [{ id: 'c1' }, { id: 'c2' }] as Cart[];
    service.getUserCarts.mockResolvedValue(mockCarts);

    const result = await controller.getUserCarts(userId);

    expect(service.getUserCarts).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockCarts);
  });

  it('debería obtener un carrito por id', async () => {
    const cartId = 'c1';
    const mockCart = { id: cartId, total: 50 } as Cart;

    service.getCartById.mockResolvedValue(mockCart);

    const result = await controller.getCart(cartId);

    expect(service.getCartById).toHaveBeenCalledWith(cartId);
    expect(result).toEqual(mockCart);
  });

  it('debería actualizar un carrito', async () => {
    const cartId = 'c1';
    const dto: UpdateCartDto = {
      cartItem: [{ productId: 'p1', name: 'Test', price: 10, quantity: 2 , image: 'a.png'}],
    };

    const updatedCart = { id: cartId, total: 20 } as Cart;
    service.updateCart.mockResolvedValue(updatedCart);

    const result = await controller.updateCart(cartId, dto);

    expect(service.updateCart).toHaveBeenCalledWith(cartId, dto);
    expect(result).toEqual(updatedCart);
  });

  it('debería eliminar un carrito', async () => {
    const cartId = 'c1';
    service.deleteCart.mockResolvedValue(undefined);

    const result = await controller.deleteCart(cartId);

    expect(service.deleteCart).toHaveBeenCalledWith(cartId);
    expect(result).toBeUndefined();
  });

  it('debería pagar un carrito y retornar la factura', async () => {
    const cartId = 'c1';
    const mockBill = { id: 'b1', numberBill: 1, total: 200 } as Bill;

    service.payCart.mockResolvedValue(mockBill);

    const result = await controller.payCart(cartId);

    expect(service.payCart).toHaveBeenCalledWith(cartId);
    expect(result).toEqual(mockBill);
  });
});
