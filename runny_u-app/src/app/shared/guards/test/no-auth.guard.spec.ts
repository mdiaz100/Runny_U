import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { NoAuthGuard } from '../no-auth.guard';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
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
        NoAuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(NoAuthGuard);
  });

  it('debería bloquear acceso y redirigir al home si el usuario ya está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Ya iniciaste sesión'
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería permitir acceso si el usuario no está logueado', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
