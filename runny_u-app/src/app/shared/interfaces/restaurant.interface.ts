export interface Restaurant {
  id: string;
  name: string;
  schedule: string;
  location: string;
  image: string;
  menu: Category[]; // Aquí debería ser un arreglo de categorías directamente
  description: string;
}

export interface Category {
  category: string; // nombre de la categoría (por ejemplo: 'Almuerzos', 'Postres')
  items: MenuItem[]; // lista de comidas dentro de la categoría
}

export interface MenuItem {
  name: string;
  price: number;
  image: string;
  description: string;
}
  