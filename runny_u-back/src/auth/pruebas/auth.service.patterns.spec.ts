import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

/**
 * Esta suite aplica los principios:
 * - FIRST: cada prueba es rápida, independiente, repetible, auto-validante y oportuna.
 * - AAA: cada prueba separa claramente Arrange / Act / Assert.
 * - Test Doubles / Mocks: sustituye dependencias por versiones simuladas.
 */

describe('AuthService (con mocks y AAA)', () => {
  let service: AuthService;
  let mockUserRepo: jest.Mocked<Repository<User>>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getToken: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserRepo = module.get(getRepositoryToken(User));
    mockUserService = module.get(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  // ==================================================
  // LOGIN CORRECTO (AAA + Jest nativo)
  // ==================================================
  it('debería devolver token si las credenciales son correctas', async () => {
    // Arrange
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: bcrypt.hashSync('123456', 10),
    } as User;

    mockUserRepo.findOneBy.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
    mockUserService.getToken.mockReturnValue('jwt-mock-token');

    // Act
    const result = await service.login({
      email: 'test@test.com',
      password: '123456',
    });

    // Assert (Jest nativo)
    expect(mockUserRepo.findOneBy).toHaveBeenCalledTimes(1);
    expect(typeof result).toBe('object');
    expect(result.success).toBe(true);
    expect(typeof result.token).toBe('string');
    expect(result.token.startsWith('jwt')).toBe(true);
  });

  // ==================================================
  // LOGIN: CONTRASEÑA INCORRECTA
  // ==================================================
  it('debería lanzar NotFoundException si la contraseña es incorrecta', async () => {
    // Arrange
    const mockUser = {
      id: '2',
      email: 'test@test.com',
      password: bcrypt.hashSync('123456', 10),
    } as User;
    mockUserRepo.findOneBy.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    // Act & Assert
    await expect(
      service.login({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserService.getToken).not.toHaveBeenCalled();
    expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({
      email: 'test@test.com',
    });
  });

  // ==================================================
  // LOGIN: USUARIO NO EXISTE
  // ==================================================
  it('debería lanzar NotFoundException si el usuario no existe', async () => {
    // Arrange
    mockUserRepo.findOneBy.mockResolvedValue(null);

    // Act & Assert
    await expect(
      service.login({ email: 'nouser@test.com', password: '123456' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockUserRepo.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockUserService.getToken).not.toHaveBeenCalled();
  });

  // ==================================================
  // SIGNUP (AAA)
  // ==================================================
  it('debería delegar en userService.create y devolver su resultado', async () => {
    // Arrange
    const dto = {
      fullname: 'Tester',
      email: 'test@test.com',
      password: '123456',
    };
    const mockResponse = { success: true, token: 'jwt-new-user' };
    mockUserService.create.mockResolvedValue(mockResponse);

    // Act
    const result = await service.signUp(dto);

    // Assert
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['success', 'token']),
    );
    expect(result.success).toBe(true);
    expect(typeof result.token).toBe('string');
  });
});


