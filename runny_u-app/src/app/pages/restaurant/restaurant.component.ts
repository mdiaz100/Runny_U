import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { NgFor, NgIf } from '@angular/common';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  imports: [NgFor, NgIf]
})
export class RestaurantComponent implements OnInit {
  route = inject(ActivatedRoute);
  restaurantService = inject(RestaurantService);
  restaurant: Restaurant | undefined;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurant = this.restaurantService.getRestaurantById(id);
    }
  }
}
