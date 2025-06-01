import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const success = this.authService.login(email, password);
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['/']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos'
      });
    }
  }
}
// This code defines a LoginComponent for an Angular application that handles user login.