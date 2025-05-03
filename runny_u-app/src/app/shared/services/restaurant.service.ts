import { Injectable } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant.interface';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurants: Restaurant[] = [
    {
      id: 'srgourmet',
      name: 'Sr.Gourmet',
      schedule: 'Abierto 6:00-19:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/srgourmet.jpg',
      description: 'Comida rápida gourmet para estudiantes con estilo.',
      menu: [
        {
          category: 'Almuerzos',
          items: [
            {
              name: 'Bandeja paisa',
              price: 12000,
              image: '/assets/menusrgourmet/almuerzos/bandejapaisa.jpg'
            },
            {
              name: 'Ensalada César',
              price: 10000,
              image: '/assets/menusrgourmet/almuerzos/ensaladacesar.jpg'
            },
            {
              name: 'Pasta alfredo',
              price: 8000,
              image: '/assets/menusrgourmet/almuerzos/pastaalfredo.jpg'
            }
          ]
        },
        {
          category: 'Bebidas',
          items: [
            {
              name: 'Jugos Naturales',
              price: 12000,
              image: '/assets/menusrgourmet/bebidas/jugosnaturales.jpg'
            },
            {
              name: 'Limonada',
              price: 10000,
              image: '/assets/menusrgourmet/bebidas/limonada.jpg'
            }
          ]
        }
      ]
    },
    {
      id: 'dogger',
      name: 'Dogger',
      schedule: 'Abierto 10:00-20:00',
      location: 'Bloque 4, Planta Baja (Boulevard de comidas)',
      image: '/assets/logos/dogger.jpg',
      description: 'Perros calientes y snacks con estilo callejero.',
      menu: [
        {
          category: 'Perros',
          items: [
            {
              name: 'Perro Callejero',
              price: 8000,
              image: '/assets/menudogger/perros/perrocallejero.jpg'
            },
            {
              name: 'Perro de la Esquina',
              price: 9000,
              image: '/assets/menudogger/perros/perrodelaesquina.jpg'
            },
            {
              name: 'Perro Super',
              price: 10000,
              image: '/assets/menudogger/perros/perrosuper.jpg'
            }
          ]
        },
        {
          category: 'Bebidas',
          items: [
            {
              name: 'Agua',
              price: 12000,
              image: '/assets/menudogger/bebidas/botelladeagua.jpg'
            },
            {
              name: 'Coca-cola',
              price: 10000,
              image: '/assets/menudogger/bebidas/gaseosa-coca-cola-400-ml.jpg'
            }
          ]
        }
      ]
    },

     {
      id: 'nativos',
      name: 'Nativos',
      schedule: 'Abierto 8:00-19:00',
      location: 'Bloque 12, Detrás de bloque 12 (fuente)',
      image: '/assets/logos/nativos.jpg',
      description: 'Bebidas y snacks con sabores vivos para estilos de vida activos.',
      menu: [
        {
          category: 'Carta',
          items: [
            {
              name: 'Ensalada de frutas',
              price: 12000,
              image: '/assets/menunativos/carta/ensaladadefrutas.jpg'
            },
            {
              name: 'Salchipapas',
              price: 14000,
              image: '/assets/menunativos/carta/salchipapas.jpg'
            }
          ]
        },
        {
          category: 'Bebidas',
          items: [
            {
              name: 'Limonada de Coco',
              price: 10000,
              image: '/assets/menunativos/bebidas/limonadadecoco.jpg'
            }
          ]
        }
      ]
    },
    {
      id: 'pimientoz',
      name: 'Pimientoz',
      schedule: 'Abierto 11:00-20:00',
      location: 'Bloque 16, Planta Baja (Piedras)',
      image: '/assets/logos/pimientoz.jpg',
      description: 'Pizza artesanal y rápida para paladares con estilo.',
      menu: [
        {
          category: 'Pizzas',
          items: [
            {
              name: 'Pizza Hawaiana',
              price: 14000,
              image: '/assets/menupimientoz/pizzas/phawaiana.jpg'
            },
            {
              name: 'Pizza de Jamón y Queso ',
              price: 14000,
              image: '/assets/menupimientoz/pizzas/pjamonyqueso.jpg'
            },
            {
              name: 'Pizza de Pollo BBQ',
              price: 16000,
              image: '/assets/menupimientoz/pizzas/ppollobbq.jpg'
            }
          ]
        },
        {
          category: 'Bebidas',
          items: [
            {
              name: 'Dispensador de Gaseosas',
              price: 4000,
              image: '/assets/menupimientoz/bebidas/dispensadorgaseosa.jpg'
            },
          ]
        }
      ]
    }
    
  ];  

  getRestaurants() {
    return this.restaurants;
  }

  getRestaurantById(id: string) {
    return this.restaurants.find(r => r.id === id);
  }
}

