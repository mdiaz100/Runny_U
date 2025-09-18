import { TestBed } from '@angular/core/testing';
import { TokenService } from '../token.service';
import { TOKEN } from '../../utils/constants';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';


import * as jwtDecodeLib from 'jwt-decode';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  it('debería decodificar y devolver el payload si el token es válido', () => {
    const fakeToken = 'valid.jwt.token';
    const fakePayload: JwtPayload = {
      id: '123',
      email: 'test@test.com',
      fullname: 'Test User',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    };

    localStorage.setItem(TOKEN, fakeToken);

    // 🔹 Aquí reemplazamos directamente la función
    (jwtDecodeLib as any).jwtDecode = jasmine
      .createSpy()
      .and.returnValue(fakePayload);

    expect(service.decodeToken()).toEqual(fakePayload);
  });

  it('debería devolver null si el token es inválido', () => {
    const fakeToken = 'invalid.jwt.token';
    localStorage.setItem(TOKEN, fakeToken);

    (jwtDecodeLib as any).jwtDecode = jasmine
      .createSpy()
      .and.throwError('Token inválido');

    expect(service.decodeToken()).toBeNull();
  });
});


