import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NgFor, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  promotions = [
    {
      badge: '20% OFF',
      image: '/assets/promociones/promosrgourmet.jpg',
      title: 'Combo Estudiante',
      restaurant: 'Sr.Gourmet',
      description: 'Almuerzo completo + bebida por solo $12.000',
      date: '30/04/2025',
      time: '11:30 - 15:00'
    },
    {
      badge: '2x1',
      image: '/assets/promociones/promodogger.jpg',
      title: 'Hot Dogs',
      restaurant: 'Dogger',
      description: 'Lleva 2 hot dogs especiales al precio de 1',
      date: '15/04/2025',
      time: 'Todo el día'
    },
    {
      badge: 'MENÚ $10K',
      image: '/assets/promociones/promopapalitas.jpg',
      title: 'Promo Nocturna',
      restaurant: 'Papaalitas',
      description: 'Hamburguesa + papas + gaseosa por $10.000',
      date: '20/04/2025',
      time: '16:00 - 18:00'
    },
  ];

  restaurant = [
    {
      name: 'Sr.Gourmet',
      schedule: 'Abierto 6:00-19:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/srgourmet.jpg',
      link: '/restaurant/srgourmet'
    },
    {
      name: 'Dogger',
      schedule: 'Abierto 10:00-20:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/dogger.jpg',
      link: '/restaurant/dogger'
    },
    {
      name: 'Sr.Gourmet',
      schedule: 'Abierto 6:00-19:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/srgourmet.jpg',
      link: '/restaurant/srgourmet'
    },
  ];

  constructor(public router: Router) {}

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}

