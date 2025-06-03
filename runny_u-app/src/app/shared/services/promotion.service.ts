import { Injectable } from '@angular/core';
import { Promotion } from '../interfaces/promotions.interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private promotions: Promotion[] = [
    {
      badge: '20% OFF',
      image: '/assets/promociones/promosrgourmet.jpg',
      title: 'Combo Estudiante',
      restaurant: 'Sr.Gourmet',
      description: 'Almuerzo completo + bebida por solo $12.000',
      date: '30/04/2025',
      time: '11:30 - 15:00',
    },
    {
      badge: '2x1',
      image: '/assets/promociones/promodogger.jpg',
      title: 'Hot Dogs',
      restaurant: 'Dogger',
      description: 'Lleva 2 hot dogs especiales al precio de 1',
      date: '15/04/2025',
      time: 'Todo el día',
    },
    {
      badge: 'MENÚ $10K',
      image: '/assets/promociones/promopapalitas.jpg',
      title: 'Promo Nocturna',
      restaurant: 'Papaalitas',
      description: 'Hamburguesa + papas + gaseosa por $10.000',
      date: '20/04/2025',
      time: '16:00 - 18:00',
    },
  ];

  getPromotions() {
    return this.promotions;
  }
}
