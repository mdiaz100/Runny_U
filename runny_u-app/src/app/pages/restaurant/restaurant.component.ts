import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../shared/services/restaurant.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  imports: [NgFor, NgIf]
})
export class RestaurantComponent implements OnInit {
  restaurant: any;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurant = this.restaurantService.getRestauranteById(id);
    }
  }
}
