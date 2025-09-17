import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly apiUrl = 'http://localhost:3000/api/restaurants'; 

  constructor(private readonly http: HttpClient) {}


  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl);
  }


  getRestaurantById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
  }
}
