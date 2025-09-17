import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'debes iniciar sesión para acceder a tu carrito.',
        confirmButtonColor: '#ffab00',
        confirmButtonText: 'OK',
      });
      this.router.navigate(['/login']);
      return false;
    }
  }
}
