import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('✅ debería crear un usuario y devolver resultado', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '123456',
        fullname: 'Test User',
      };

      const mockResponse = { success: true, token: 'mock-token' };
      service.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResponse);
    });

    it('❌ debería lanzar BadRequestException si ocurre un error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'fail@test.com',
        password: '123456',
        fullname: 'Fail User',
      };

      service.create.mockRejectedValue(new BadRequestException());

      await expect(controller.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('✅ debería llamar al servicio update con id y dto', () => {
      const updateUserDto: UpdateUserDto = { fullname: 'Nuevo Nombre' };
      service.update.mockReturnValue('This action updates a #1 user');

      const result = controller.update('1', updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual('This action updates a #1 user');
    });
  });

  describe('remove', () => {
    it('✅ debería llamar al servicio remove con id', () => {
      service.remove.mockReturnValue('This action removes a #1 user');

      const result = controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual('This action removes a #1 user');
    });
  });
});
