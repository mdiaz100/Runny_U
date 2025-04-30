import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
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

    if (!email?.endsWith('@soyudemedellin.edu.co')) {
      alert('El correo debe ser del dominio @soyudemedellin.edu.co');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.authService.isEmailRegistered(email)) {
      alert('Este correo ya está registrado');
      return;
    }

    

    this.authService.addUser({ fullname, email, password });
    alert('Registro exitoso');
    this.router.navigate(['/login']);
  }
}

