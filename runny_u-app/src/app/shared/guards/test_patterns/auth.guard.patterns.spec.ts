import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AuthGuard } from '../auth.guard';

describe('AuthGuard Patterns', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    //  Arrange: configuración de los test doubles
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    //  Mock de SweetAlert (Fake)
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false
      } as SweetAlertResult<any>)
    );

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    //  Limpieza de espías para asegurar independencia (FIRST)
    authServiceMock.isLoggedIn.calls.reset();
    routerSpy.navigate.calls.reset();
  });

  it('debería crearse el guard (Dummy Test)', () => {
    // Arrange
    const dummy = guard;

    // Act & Assert (Fluent)
    expect(dummy).withContext('El guard debería existir').toBeTruthy();
  });

  it('debería permitir el acceso si el usuario está autenticado (Mock + AAA)', () => {
    // Arrange
    authServiceMock.isLoggedIn.and.returnValue(true);

    // Act
    const result = guard.canActivate();

    // Assert - Fluent Assertions
    expect(result)
      .withContext('Debería devolver true si el usuario está logueado')
      .toBeTrue();
    expect(routerSpy.navigate)
      .withContext('No debe redirigir si ya está autenticado')
      .not.toHaveBeenCalled();
    expect(Swal.fire)
      .withContext('No debe mostrar alerta si el acceso está permitido')
      .not.toHaveBeenCalled();
  });

  it('debería bloquear el acceso y redirigir al login si el usuario NO está autenticado (Stub + Spy)', () => {
    // Arrange
    authServiceMock.isLoggedIn.and.returnValue(false);

    // Act
    const result = guard.canActivate();

    // Assert
    expect(result)
      .withContext('Debería devolver false si el usuario NO está logueado')
      .toBeFalse();
    expect(Swal.fire)
      .withContext('Debe mostrar una alerta de advertencia')
      .toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'debes iniciar sesión para acceder a tu carrito.'
      }));
    expect(routerSpy.navigate)
      .withContext('Debe redirigir al login')
      .toHaveBeenCalledWith(['/login']);
  });

  it('debería llamar una sola vez a Swal.fire en caso de bloqueo (Spy Verification)', () => {
    // Arrange
    authServiceMock.isLoggedIn.and.returnValue(false);

    // Act
    guard.canActivate();

    // Assert
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });
});
