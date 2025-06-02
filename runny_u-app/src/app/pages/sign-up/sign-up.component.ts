import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class SignUpComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);

  signupForm = this.fb.group({
    fullname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  });

  onSubmit(): void {
    const fullname = this.signupForm.value.fullname ?? '';
    const email = this.signupForm.value.email ?? '';
    const password = this.signupForm.value.password ?? '';
    const confirmPassword = this.signupForm.value.confirmPassword ?? '';
    const terms = this.signupForm.value.terms ?? false;

    if (this.isEmpty(fullname) || this.isEmpty(email) || this.isEmpty(password) || this.isEmpty(confirmPassword)) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios'
      });
      return;
    }

    if (!email.endsWith('@soyudemedellin.edu.co')) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo inválido',
        text: 'El correo debe ser del dominio @soyudemedellin.edu.co'
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales'
      });
      return;
    }

    if (this.authService.isEmailRegistered(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo ya registrado',
        text: 'Este correo ya está en uso'
      });
      return;
    }

    if (!terms) {
      Swal.fire({
        icon: 'info',
        title: 'Términos y condiciones',
        text: 'Debes aceptar los términos y condiciones'
      });
      return;
    }

    this.authService.addUser({ fullname, email, password });

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Tu cuenta ha sido creada correctamente',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  isEmpty(value: string): boolean {
    return value.trim().length === 0;
  }
}
// melito