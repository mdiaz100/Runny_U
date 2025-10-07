import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';


describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  //  Mock de JwtService
  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  } as unknown as jest.Mocked<JwtService>;

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
    jest.clearAllMocks(); // Limpieza total (FIRST: Repeatable)
  });

  //  Caso 1: Crear usuario exitosamente
  describe('create', () => {
    it(' debería crear un usuario y devolver success + token', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@test.com',
        password: '123456',
        fullname: 'Test User',
      };
      const hashedPassword = 'hashed123';

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

      const mockUser: User = {
        id: '1',
        email: createUserDto.email,
        fullname: createUserDto.fullname,
        password: hashedPassword,
      } as User;

      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(service, 'getToken').mockReturnValue('mock-token');

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(bcrypt.hashSync).toHaveBeenCalledWith('123456', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        fullname: createUserDto.fullname,
        password: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        success: true,
        token: 'mock-token',
      });
    });

    it(' debería lanzar BadRequestException si ocurre un error', async () => {
      // Arrange
      const createUserDto = {
        email: 'fail@test.com',
        password: '123456',
        fullname: 'Fail User',
      };

      userRepository.create.mockImplementation(() => {
        throw { code: '123', detail: 'some error' };
      });

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Caso 2: update()
  describe('update', () => {
    it(' debería retornar mensaje de actualización', () => {
      // Arrange
      const id = 1;
      const dto = { fullname: 'Nuevo Nombre' };

      // Act
      const result = service.update(id, dto);

      // Assert
      expect(result).toEqual('This action updates a #1 user');
    });
  });

  //  Caso 3: remove()
  describe('remove', () => {
    it(' debería retornar mensaje de eliminación', () => {
      // Arrange
      const id = 1;

      // Act
      const result = service.remove(id);

      // Assert
      expect(result).toEqual('This action removes a #1 user');
    });
  });

  //  Caso 4: getToken()
  describe('getToken', () => {
    it(' debería generar un token JWT sin incluir la contraseña', () => {
      // Arrange
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullname: 'Test User',
        password: 'hashed',
      } as User;

      // Act
      const token = service.getToken(mockUser);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: '1',
        email: 'test@test.com',
        fullname: 'Test User',
      });
      expect(token).toBe('mock-jwt-token');
    });
  });
});
