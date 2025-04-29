import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { Promotion } from '../../shared/interfaces/promotions.interface';
import { PromotionService } from '../../services/promotion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterModule, FormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  restaurant: Restaurant[] = [];
  promotions: Promotion[] = [];

  searchTerm: string = ''; // para el término de búsqueda
  filteredRestaurants: Restaurant[] = [];
  showSearchResults: boolean = false; // controla si el modal aparece


  router = inject(Router);
  restaurantService = inject(RestaurantService);
  promotionService = inject(PromotionService);

  ngOnInit(): void {
    this.restaurant = this.restaurantService.getRestaurants();
    this.promotions = this.promotionService.getPromotions();

    this.filteredRestaurants = this.restaurant; // Mostrar todos inicialmente
  }

  onSearch(event: Event): void {
    event.preventDefault();
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredRestaurants = this.restaurant.filter(r =>
      r.name.toLowerCase().includes(term)
    );
    this.showSearchResults = true; // abre el modal
  }
  
  closeSearchResults(): void {
    this.showSearchResults = false;
  }
  
}
