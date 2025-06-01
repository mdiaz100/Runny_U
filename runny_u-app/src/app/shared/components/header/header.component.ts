import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';
import { Restaurant } from '../../interfaces/restaurant.interface';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2'; // ✅ Importar SweetAlert2

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: User | null = null;

  showProfileModal: boolean = false;
  searchTerm: string = '';
  showSearchResults: boolean = false;
  filteredRestaurants: Restaurant[] = [];
  allRestaurants: Restaurant[] = [];

  isRestaurantDetailRoute: boolean = false;
  totalItems: number = 0;

  authService = inject(AuthService);
  cartService = inject(CartService);
  restaurantService = inject(RestaurantService);
  router = inject(Router);

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getLoggedInUser();
    this.allRestaurants = this.restaurantService.getRestaurants();
    this.filteredRestaurants = this.allRestaurants;

    this.onUpdateRouteState(this.router.url);

    this.cartService.totalItems$.subscribe(count => {
      this.totalItems = count;
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.onUpdateRouteState(event.urlAfterRedirects);
      });
  }

  onUpdateRouteState(url: string): void {
    this.isRestaurantDetailRoute = /^\/restaurant\/[^\/]+$/.test(url);
  }

  onLogout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.isLoggedIn = false;
    this.user = null;

    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  onOpenProfileModal(): void {
    this.showProfileModal = true;
  }

  onCloseProfileModal(): void {
    this.showProfileModal = false;
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredRestaurants = this.allRestaurants.filter(r =>
      r.name.toLowerCase().includes(term)
    );
    this.showSearchResults = true;
  }

  onCloseSearchResults(): void {
    this.showSearchResults = false;
  }
}
// MELO