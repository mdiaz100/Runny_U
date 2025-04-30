import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Promotion } from '../../shared/interfaces/promotions.interface';
import { PromotionService } from '../../shared/services/promotion.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/interfaces/user.interface';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterModule, FormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurant: Restaurant[] = [];
  promotions: Promotion[] = [];

  searchTerm: string = '';
  filteredRestaurants: Restaurant[] = [];
  showSearchResults: boolean = false;

  isLoggedIn: boolean = false;
  user: User | null = null; 

  router = inject(Router);
  restaurantService = inject(RestaurantService);
  promotionService = inject(PromotionService);
  authService = inject(AuthService);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.restaurant = this.restaurantService.getRestaurants();
    this.promotions = this.promotionService.getPromotions();
    this.filteredRestaurants = this.restaurant;

    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getLoggedInUser();
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredRestaurants = this.restaurant.filter(r =>
      r.name.toLowerCase().includes(term)
    );
    this.showSearchResults = true;
  }

  closeSearchResults(): void {
    this.showSearchResults = false;
  }

  logout(): void {
    this.authService.logout();
    alert('Sesión cerrada.');
    this.router.navigate(['/']);
    this.isLoggedIn = false;
    this.user = null;
    this.cartService.clearCart();
  }
}

