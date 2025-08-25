import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CartItem } from './dto/cart-item.dto';
import { Bill } from '../bill/entities/bill.entity';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}, // mock vacío, no lo usamos en esta prueba
        },
        {
          provide: getRepositoryToken(Bill),
          useValue: {}, // mock vacío, no lo usamos en esta prueba
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
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

    const expectedCart: Cart = {
      id: '1',
      user,
      cartItems,
      total: 350,
    } as Cart;

    (cartRepository.create as jest.Mock).mockReturnValue(expectedCart);
    (cartRepository.save as jest.Mock).mockResolvedValue(expectedCart);

    const result = await service.createCart(user, cartItems);

    expect(cartRepository.create).toHaveBeenCalledWith({
      user,
      cartItems,
      total: 350,
    });
    expect(cartRepository.save).toHaveBeenCalledWith(expectedCart);
    expect(result).toEqual(expectedCart);
  });
});

