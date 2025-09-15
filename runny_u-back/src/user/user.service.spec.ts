import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;

  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('✅ debería crear un usuario y devolver success y token', async () => {
      const createUserDto = {
        email: 'test@test.com',
        password: '123456',
        fullname: 'Test User',
      };

      const hashedPassword = 'hashed123';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const mockUser = {
        id: '1',
        email: createUserDto.email,
        fullname: createUserDto.fullname,
        password: hashedPassword,
      } as User;

      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getToken').mockReturnValue('mock-token');

      const result = await service.create(createUserDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('123456', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        password: hashedPassword,
        email: createUserDto.email,
        fullname: createUserDto.fullname,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        token: 'mock-token',
      });
    });

    it('❌ debería lanzar BadRequestException si ocurre un error', async () => {
      const createUserDto = {
        email: 'fail@test.com',
        password: '123456',
        fullname: 'Fail User',
      };

      userRepository.create.mockImplementation(() => {
        throw { code: '123', detail: 'some error' };
      });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('✅ debería retornar mensaje de actualización', () => {
      const result = service.update(1, { fullname: 'Nuevo Nombre' });
      expect(result).toEqual('This action updates a #1 user');
    });
  });

  describe('remove', () => {
    it('✅ debería retornar mensaje de eliminación', () => {
      const result = service.remove(1);
      expect(result).toEqual('This action removes a #1 user');
    });
  });

  describe('getToken', () => {
    it('✅ debería generar un token JWT sin incluir la contraseña', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullname: 'Test User',
        password: 'hashed',
      } as User;

      const token = service.getToken(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: '1',
        email: 'test@test.com',
        fullname: 'Test User',
      });
      expect(token).toEqual('mock-jwt-token');
    });
  });
});



