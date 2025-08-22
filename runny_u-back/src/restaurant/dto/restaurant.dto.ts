// src/restaurants/dto/restaurant.dto.ts
export interface MenuItemDto {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CategoryDto {
  category: string;
  items: MenuItemDto[];
}

export interface RestaurantDto {
  id: string;
  name: string;
  schedule: string;
  location: string;
  image: string;
  description: string;
  menu: CategoryDto[];
}
