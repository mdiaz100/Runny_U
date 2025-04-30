import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const success = this.authService.login(email, password);
    if (success) {
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/home']); // o el path de tu página principal
    } else {
      alert('Correo o contraseña incorrectos');
    }
  }
}

