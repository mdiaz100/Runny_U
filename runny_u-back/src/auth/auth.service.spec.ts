import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let userService: jest.Mocked<UserService>;

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
    userRepository = module.get(getRepositoryToken(User));
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('✅ debería devolver token si las credenciales son correctas', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: bcrypt.hashSync('123456', 10),
      };

      userRepository.findOneBy.mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      userService.getToken.mockReturnValue('fake-jwt-token');

      const result = await service.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('123456', mockUser.password);
      expect(userService.getToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        token: 'fake-jwt-token',
      });
    });

    it('❌ debería lanzar NotFoundException si la contraseña es incorrecta', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: bcrypt.hashSync('123456', 10),
      };

      userRepository.findOneBy.mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrong', mockUser.password);
      expect(userService.getToken).not.toHaveBeenCalled();
    });

    it('❌ debería lanzar NotFoundException si el usuario no existe', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nouser@test.com', password: '123456' }),
      ).rejects.toThrow(NotFoundException);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: 'nouser@test.com' });
      expect(userService.getToken).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('✅ debería delegar en userService.create y devolver su resultado', async () => {
      const dto = {
        fullname: 'Test User',
        email: 'test@test.com',
        password: '123456',
      };
      const mockResponse = { success: true, token: 'fake-jwt-token' };

      userService.create.mockResolvedValue(mockResponse);

      const result = await service.signUp(dto);

      expect(userService.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '123456',
        fullname: 'Test User',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});

