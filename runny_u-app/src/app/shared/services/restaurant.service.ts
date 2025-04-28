import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurants = [
    {
      id: 'srgourmet',
      name: 'Sr.Gourmet',
      schedule: 'Abierto 6:00-19:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/srgourmet.jpg',
      menu: [
        { name: 'bandeja paisa', price: 12000, image: '/assets/menusrgourmet/bandejapaisa.jpg' },
        { name: 'Ensalada cesar', price: 10000, image: '/assets/menusrgourmet/ensaladacesar.jpg' },
      ],
      description: 'Comida rápida gourmet para estudiantes con estilo.'
    },
    {
      id: 'dogger',
      name: 'Dogger',
      schedule: 'Abierto 10:00-20:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/dogger.jpg',
      menu: [
        { name: 'Hot Dog clásico', price: 8000 },
        { name: 'Salchipapa especial', price: 9000 },
      ],
      description: 'Perros calientes y snacks con estilo callejero.'
    },
    // Agrega más restaurantes...
  ];

  getRestaurantes() {
    return this.restaurants;
  }

  getRestauranteById(id: string) {
    return this.restaurants.find(r => r.id === id);
  }
}

