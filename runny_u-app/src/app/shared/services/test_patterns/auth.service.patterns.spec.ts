import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { User } from '../../interfaces/user.interface';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { TOKEN } from '../../utils/constants';

describe('AuthService Patterns', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceMock: jasmine.SpyObj<TokenService>;

  //  Arrange - Datos base (Dummy Data)
  const dummyUser: User = {
    fullname: 'Test User',
    email: 'test@test.com',
    password: '123456'
  };

  const fakeJwt: JwtPayload = {
    id: '1',
    fullname: 'Test User',
    email: 'test@test.com',
    iat: 123456,
    exp: 123999
  };

  beforeEach(() => {
    //  Test Double: Mock de TokenService
    tokenServiceMock = jasmine.createSpyObj('TokenService', [
      'decodeToken',
      'isTokenExpired',
      'clearToken'
    ]);

    tokenServiceMock.decodeToken.and.returnValue(fakeJwt);
    tokenServiceMock.isTokenExpired.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  //  Patrón AAA + Fluent assertions
  it('debería registrarse (signUp) y guardar el token', () => {
    // Arrange
    const fakeToken = 'fake-jwt-token';

    // Act
    service.signUp(dummyUser).subscribe();

    // Assert
    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/sign-up');
    expect(req.request.method).toBe('POST');
    req.flush({ token: fakeToken });

    expect(localStorage.getItem(TOKEN))
      .withContext('El token debe guardarse en localStorage')
      .toBe(fakeToken);

    expect(tokenServiceMock.decodeToken)
      .withContext('El token debe decodificarse al registrarse')
      .toHaveBeenCalled();
  });

  it('debería iniciar sesión (login) y guardar token', () => {
    // Arrange
    const fakeToken = 'fake-jwt-token';

    // Act
    service.login(dummyUser.email, dummyUser.password).subscribe();

    // Assert
    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: dummyUser.email, password: dummyUser.password });
    req.flush({ token: fakeToken });

    expect(localStorage.getItem(TOKEN)).toBe(fakeToken);
    expect(tokenServiceMock.decodeToken).toHaveBeenCalled();
  });

  it('debería cerrar sesión (logout) limpiando token y usuario', () => {
    // Act
    service.logout();

    // Assert
    expect(tokenServiceMock.clearToken)
      .withContext('El servicio de token debe limpiar el almacenamiento')
      .toHaveBeenCalled();

    service.user$.subscribe(user => {
      expect(user)
        .withContext('Después de logout, el usuario debe ser null')
        .toBeNull();
    });
  });

  it('debería retornar true si el token no ha expirado', () => {
    // Arrange
    tokenServiceMock.isTokenExpired.and.returnValue(false);

    // Act
    const result = service.isLoggedIn();

    // Assert
    expect(result)
      .withContext('Debe retornar true si el token sigue vigente')
      .toBeTrue();
  });

  it('debería retornar false si el token ha expirado', () => {
    // Arrange
    tokenServiceMock.isTokenExpired.and.returnValue(true);

    // Act
    const result = service.isLoggedIn();

    // Assert
    expect(result)
      .withContext('Debe retornar false si el token expiró')
      .toBeFalse();
  });

  it('debería retornar el usuario decodificado (Fake)', () => {
    // Act
    const result = service.getUser();

    // Assert
    expect(result)
      .withContext('Debe devolver los datos decodificados del token')
      .toEqual(fakeJwt);
  });

  it('debería retornar null en getLoggedInUser si no hay token', () => {
    // Arrange
    tokenServiceMock.decodeToken.and.returnValue(null);

    // Act
    const result = service.getLoggedInUser();

    // Assert
    expect(result)
      .withContext('Debe retornar null si no existe token')
      .toBeNull();
  });
});
