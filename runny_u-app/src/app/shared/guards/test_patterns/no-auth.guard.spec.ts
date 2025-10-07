import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { NoAuthGuard } from '../no-auth.guard';

describe('NoAuthGuard Patterns', () => {
  let guard: NoAuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  //  Arrange Global: configuración antes de cada prueba
  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    //  Fake: simulamos el comportamiento de SweetAlert2
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false
      } as SweetAlertResult<any>)
    );

    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(NoAuthGuard);
  });

  //  Limpieza después de cada test (FIRST → Independientes)
  afterEach(() => {
    authServiceMock.isLoggedIn.calls.reset();
    routerSpy.navigate.calls.reset();
  });

  it('debería crearse correctamente el guard (Dummy Test)', () => {
    // Arrange
    const dummyGuard = guard;

    // Act & Assert
    expect(dummyGuard)
      .withContext('El guard debería existir correctamente')
      .toBeTruthy();
  });

  it('debería bloquear acceso y redirigir al home si el usuario ya está logueado (Mock + Spy)', () => {
    //  Arrange
    authServiceMock.isLoggedIn.and.returnValue(true);

    //  Act
    const result = guard.canActivate();

    //  Assert (Fluent Assertions)
    expect(result)
      .withContext('Debe retornar false si el usuario ya está logueado')
      .toBeFalse();

    expect(Swal.fire)
      .withContext('Debe mostrar un mensaje de advertencia al usuario logueado')
      .toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'warning',
        title: 'Ya iniciaste sesión'
      }));

    expect(routerSpy.navigate)
      .withContext('Debe redirigir al usuario al home')
      .toHaveBeenCalledWith(['/']);
  });

  it('debería permitir acceso si el usuario NO está logueado (Stub + AAA)', () => {
    //  Arrange
    authServiceMock.isLoggedIn.and.returnValue(false);

    //  Act
    const result = guard.canActivate();

    //  Assert (Fluent)
    expect(result)
      .withContext('Debe devolver true si el usuario no está logueado')
      .toBeTrue();

    expect(Swal.fire)
      .withContext('No debe mostrar ninguna alerta si no hay sesión activa')
      .not.toHaveBeenCalled();

    expect(routerSpy.navigate)
      .withContext('No debe redirigir al home')
      .not.toHaveBeenCalled();
  });

  it('debería llamar a Swal.fire y Router.navigate una sola vez (Spy Verification)', () => {
    //  Arrange
    authServiceMock.isLoggedIn.and.returnValue(true);

    //  Act
    guard.canActivate();

    //  Assert
    expect(Swal.fire)
      .withContext('Swal.fire debe ser llamado una sola vez')
      .toHaveBeenCalledTimes(1);

    expect(routerSpy.navigate)
      .withContext('navigate debe ser llamado una sola vez')
      .toHaveBeenCalledTimes(1);
  });
});
