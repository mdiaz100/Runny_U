export interface Restaurant {
  id: string;
  name: string;
  schedule: string;
  location: string;
  image: string;
  menu: Category[];
  description: string;
}


export interface Category {
  category: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}
