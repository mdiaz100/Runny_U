import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { NgFor, NgIf } from '@angular/common';
import { Restaurant } from '../../shared/interfaces/restaurant.interface';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../shared/interfaces/cart-item.interface';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
  imports: [NgFor, NgIf]
})
export class RestaurantComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  restaurantService = inject(RestaurantService);
  cartService = inject(CartService);
  restaurant: Restaurant | undefined;
  cartItems: CartItem[] | undefined;
  totalCart: number | undefined;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurant = this.restaurantService.getRestaurantById(id);
    }
  }

  onAddToCart(item: { name: string; price: number; image: string }) {
    this.cartService.addItem({ ...item, quantity: 1 });
    console.log(`${item.name} añadido al carrito`);
    console.log(this.cartService.getItems());
    console.log(`Total: ${this.cartService.getTotal()}`);
    this.totalCart = this.cartService.getTotalItems();
  }
}
