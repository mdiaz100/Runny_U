export interface Restaurant {
  id: string;
  name: string;
  schedule: string;
  location: string;
  image: string;
  menu: Menu[];
  description: string;
}

interface Menu {
  name: string;
  price: number;
  image: string;
}