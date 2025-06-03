import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Ya iniciaste sesión',
        confirmButtonColor: '#ffab00',
        confirmButtonText: 'OK',
      });
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
