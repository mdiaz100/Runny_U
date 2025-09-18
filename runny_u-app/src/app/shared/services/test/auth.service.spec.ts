import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { TokenService } from '../token.service';
import { TOKEN } from '../../utils/constants';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceMock: any;

  const mockUser: User = {
    fullname: 'Test User',
    email: 'test@test.com',
    password: '123456'
  };

  const mockJwt: JwtPayload = {
    id: '1',
    fullname: 'Test User',
    email: 'test@test.com',
    iat: 123456,
    exp: 123999
  };

  beforeEach(() => {
    tokenServiceMock = {
      decodeToken: jasmine.createSpy('decodeToken').and.returnValue(mockJwt),
      isTokenExpired: jasmine.createSpy('isTokenExpired').and.returnValue(false),
      clearToken: jasmine.createSpy('clearToken')
    };

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

  it('debería registrarse (signUp) y guardar token', () => {
    const fakeToken = 'fake-jwt-token';

    service.signUp(mockUser).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/sign-up');
    expect(req.request.method).toBe('POST');
    req.flush({ token: fakeToken });

    expect(localStorage.getItem(TOKEN)).toBe(fakeToken);
    expect(tokenServiceMock.decodeToken).toHaveBeenCalled();
  });

  it('debería iniciar sesión (login) y guardar token', () => {
    const fakeToken = 'fake-jwt-token';

    service.login(mockUser.email, mockUser.password).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockUser.email, password: mockUser.password });
    req.flush({ token: fakeToken });

    expect(localStorage.getItem(TOKEN)).toBe(fakeToken);
    expect(tokenServiceMock.decodeToken).toHaveBeenCalled();
  });

  it('debería cerrar sesión (logout) limpiando token y usuario', () => {
    service.logout();

    expect(tokenServiceMock.clearToken).toHaveBeenCalled();
    service.user$.subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('debería retornar true si el token no ha expirado', () => {
    tokenServiceMock.isTokenExpired.and.returnValue(false);

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('debería retornar false si el token ha expirado', () => {
    tokenServiceMock.isTokenExpired.and.returnValue(true);

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('debería retornar el usuario decodificado', () => {
    expect(service.getUser()).toEqual(mockJwt);
  });

  it('debería retornar null en getLoggedInUser si no hay usuario', () => {
    tokenServiceMock.decodeToken.and.returnValue(null);

    expect(service.getLoggedInUser()).toBeNull();
  });
});
