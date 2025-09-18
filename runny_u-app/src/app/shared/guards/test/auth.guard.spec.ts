import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { AuthGuard } from '../auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: jasmine.createSpy('isLoggedIn')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

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
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('debería permitir el acceso si el usuario está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('debería bloquear acceso y redirigir al login si el usuario no está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'debes iniciar sesión para acceder a tu carrito.'
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
