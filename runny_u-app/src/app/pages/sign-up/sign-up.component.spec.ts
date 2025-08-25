import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      signUp: jasmine.createSpy('signUp')
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
      imports: [ReactiveFormsModule, SignUpComponent], 
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;

    component.signupForm.setValue({
      fullname: 'Test User',
      email: 'test@soyudemedellin.edu.co',
      password: '123456',
      confirmPassword: '123456',
      terms: true
    });
  });

  it('debería mostrar error si hay campos incompletos', () => {
    component.signupForm.patchValue({ fullname: '' });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Campos incompletos'
    }));
    expect(authServiceMock.signUp).not.toHaveBeenCalled();
  });

  it('debería mostrar error si el correo no es del dominio permitido', () => {
    component.signupForm.patchValue({ email: 'test@gmail.com' });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Correo inválido'
    }));
    expect(authServiceMock.signUp).not.toHaveBeenCalled();
  });

  it('debería mostrar error si las contraseñas no coinciden', () => {
    component.signupForm.patchValue({ confirmPassword: '654321' });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Contraseñas no coinciden'
    }));
    expect(authServiceMock.signUp).not.toHaveBeenCalled();
  });

  it('debería mostrar aviso si no acepta términos y condiciones', () => {
    component.signupForm.patchValue({ terms: false });

    component.onSubmit();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'info',
      title: 'Términos y condiciones'
    }));
    expect(authServiceMock.signUp).not.toHaveBeenCalled();
  });

  it('debería registrar usuario y navegar en caso de éxito', async () => {
    authServiceMock.signUp.and.returnValue(of({}));

    await component.onSubmit();

    expect(authServiceMock.signUp).toHaveBeenCalledWith({
      fullname: 'Test User',
      email: 'test@soyudemedellin.edu.co',
      password: '123456'
    });
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Registro exitoso'
    }));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería mostrar error si el registro falla', async () => {
    authServiceMock.signUp.and.returnValue(throwError(() => new Error('Correo ya registrado')));

    await component.onSubmit();

    expect(authServiceMock.signUp).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo registrar el usuario, Correo ya registrado'
    }));
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
