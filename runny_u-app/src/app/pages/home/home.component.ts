import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Promotion } from '../../shared/interfaces/promotions.interface';
import { PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  restaurant: Restaurant[] | undefined;
  promotions: Promotion[] | undefined;

  router = inject(Router);
  restaurantService = inject(RestaurantService);
  promotionService = inject(PromotionService);

  ngOnInit(): void {
    this.restaurant = this.restaurantService.getRestaurants();
    this.promotions = this.promotionService.getPromotions();
  }
}

