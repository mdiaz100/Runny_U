import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-request.dto';
import { SignUpDto } from './dto/sign-up-request.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería llamar al servicio con el dto y retornar la respuesta', async () => {
      const dto: LoginDto = { email: 'test@mail.com', password: '123456' };
      const result = { accessToken: 'token123' };

      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('signUp', () => {
    it('debería llamar al servicio con el dto y retornar la respuesta', async () => {
      const dto: SignUpDto = { email: 'new@mail.com', password: '123456', fullname: 'userTest' };
      const result = { id: 1, email: dto.email, username: dto.fullname };

      mockAuthService.signUp.mockResolvedValue(result);

      const response = await controller.signUp(dto);

      expect(service.signUp).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });
});
