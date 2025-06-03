import { Injectable } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant.interface';

@Injectable({
  providedIn: 'root',
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
              id: '1',
              name: 'Bandeja paisa',
              price: 12000,
              image: '/assets/menusrgourmet/almuerzos/bandejapaisa.jpg',
              description:
                'Arroz, frijoles, carne molida, chicharrón, huevo frito, plátano maduro, arepa y aguacate.',
            },
            {
              id: '2',
              name: 'Ensalada César',
              price: 10000,
              image: '/assets/menusrgourmet/almuerzos/ensaladacesar.jpg',
              description:
                'Lechuga romana, croutones, queso parmesano, aderezo César y pollo a la parrilla.',
            },
            {
              id: '3',
              name: 'Pasta alfredo',
              price: 8000,
              image: '/assets/menusrgourmet/almuerzos/pastaalfredo.jpg',
              description:
                'Pasta en salsa cremosa de queso parmesano, mantequilla y ajo, con trozos de pollo.',
            },
          ],
        },
        {
          category: 'Bebidas',
          items: [
            {
              id: '1',
              name: 'Jugos Naturales',
              price: 12000,
              image: '/assets/menusrgourmet/bebidas/jugosnaturales.jpg',
              description:
                'Variedad de jugos frescos de temporada: mango, maracuyá, guayaba o lulo.',
            },
            {
              id: '2',
              name: 'Limonada',
              price: 10000,
              image: '/assets/menusrgourmet/bebidas/limonada.jpg',
              description:
                'Limonada natural con hierbabuena, endulzada al gusto.',
            },
          ],
        },
      ],
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
              id: '1',
              name: 'Perro Callejero',
              price: 8000,
              image: '/assets/menudogger/perros/perrocallejero.jpg',
              description:
                'Salchicha, cebolla picada, salsa de piña, queso rallado y papas chips trituradas.',
            },
            {
              id: '2',
              name: 'Perro de la Esquina',
              price: 9000,
              image: '/assets/menudogger/perros/perrodelaesquina.jpg',
              description:
                'Salchicha con tocineta, ensalada de repollo, salsa rosada y queso fundido.',
            },
            {
              id: '3',
              name: 'Perro Super',
              price: 10000,
              image: '/assets/menudogger/perros/perrosuper.jpg',
              description:
                'Doble salchicha, ripio de papa, maíz dulce, salsa de ajo y mostaza.',
            },
          ],
        },
        {
          category: 'Bebidas',
          items: [
            {
              id: '1',
              name: 'Agua',
              price: 12000,
              image: '/assets/menudogger/bebidas/botelladeagua.jpg',
              description: 'Botella de agua mineral 500ml.',
            },
            {
              id: '2',
              name: 'Coca-cola',
              price: 10000,
              image: '/assets/menudogger/bebidas/gaseosa-coca-cola-400-ml.jpg',
              description: 'Gaseosa Coca-Cola 400ml bien fría.',
            },
          ],
        },
      ],
    },
    {
      id: 'nativos',
      name: 'Nativos',
      schedule: 'Abierto 8:00-19:00',
      location: 'Bloque 12, Detrás de bloque 12 (fuente)',
      image: '/assets/logos/nativos.jpg',
      description:
        'Bebidas y snacks con sabores vivos para estilos de vida activos.',
      menu: [
        {
          category: 'Carta',
          items: [
            {
              id: '1',
              name: 'Ensalada de frutas',
              price: 12000,
              image: '/assets/menunativos/carta/ensaladadefrutas.jpg',
              description:
                'Mezcla de frutas frescas de temporada con miel y granola.',
            },
            {
              id: '2',
              name: 'Salchipapas',
              price: 14000,
              image: '/assets/menunativos/carta/salchipapas.jpg',
              description:
                'Papas fritas crocantes con salchichas, salsas a elección y toppings.',
            },
          ],
        },
        {
          category: 'Bebidas',
          items: [
            {
              id: '1',
              name: 'Limonada de Coco',
              price: 10000,
              image: '/assets/menunativos/bebidas/limonadadecoco.jpg',
              description:
                'Refrescante limonada con leche de coco y hierbabuena.',
            },
          ],
        },
      ],
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
              id: '1',
              name: 'Pizza Hawaiana',
              price: 14000,
              image: '/assets/menupimientoz/pizzas/phawaiana.jpg',
              description:
                'Base de tomate, jamón, piña y queso mozzarella gratinado.',
            },
            {
              id: '2',
              name: 'Pizza de Jamón y Queso',
              price: 14000,
              image: '/assets/menupimientoz/pizzas/pjamonyqueso.jpg',
              description:
                'Clásica pizza con salsa de tomate, jamón y doble queso mozzarella.',
            },
            {
              id: '3',
              name: 'Pizza de Pollo BBQ',
              price: 16000,
              image: '/assets/menupimientoz/pizzas/ppollobbq.jpg',
              description:
                'Pollo desmechado en salsa BBQ, cebolla caramelizada y queso fundido.',
            },
          ],
        },
        {
          category: 'Bebidas',
          items: [
            {
              id: '1',
              name: 'Dispensador de Gaseosas',
              price: 4000,
              image: '/assets/menupimientoz/bebidas/dispensadorgaseosa.jpg',
              description:
                'Vaso de gaseosa surtida (Coca-Cola, Sprite o Fanta) con hielo.',
            },
          ],
        },
      ],
    },
  ];

  getRestaurants() {
    return this.restaurants;
  }

  getRestaurantById(id: string) {
    return this.restaurants.find((r) => r.id === id);
  }
}
