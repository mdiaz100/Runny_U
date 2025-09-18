import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login')
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

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    
    component.loginForm.setValue({
      email: 'test@soyudemedellin.edu.co',
      password: '123456'
    });
  });

  it('debería llamar a authService.login y navegar en caso de éxito', fakeAsync(() => {
    authServiceMock.login.and.returnValue(of({}));

    component.onSubmit();
    tick(); 

    expect(authServiceMock.login).toHaveBeenCalledWith('test@soyudemedellin.edu.co', '123456');
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Inicio de sesión exitoso'
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debería mostrar error si login falla', fakeAsync(() => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('Credenciales inválidas')));

    component.onSubmit();
    tick(); 

    expect(authServiceMock.login).toHaveBeenCalledWith('test@soyudemedellin.edu.co', '123456');
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'Correo o contraseña incorrectos'
    }));
  }));
});


