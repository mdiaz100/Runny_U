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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterModule, FormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  restaurants: Restaurant[] = [];
  promotions: Promotion[] = [];
  isLoggedIn: boolean = false;
  user: User | null = null;

  router = inject(Router);
  restaurantService = inject(RestaurantService);
  promotionService = inject(PromotionService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => (this.restaurants = data),
      error: (err) => console.error('Error cargando restaurantes', err),
    });
    this.promotions = this.promotionService.getPromotions();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getLoggedInUser();
  }
}
