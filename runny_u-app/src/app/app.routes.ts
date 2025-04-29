import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {   path: 'restaurant/:id', 
        component: RestaurantComponent 
    },
    {   path: 'cart',
        component: CartComponent
    }
];
