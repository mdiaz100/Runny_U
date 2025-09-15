import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { RestaurantDto } from './dto/restaurant.dto';

@Injectable()
export class RestaurantService {
  private readonly supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
 );

  async findAll(): Promise<RestaurantDto[]> {
    const { data, error } = await this.supabase.rpc('get_restaurants_with_menu');

    if (error) {
      console.error('Supabase RPC error:', error);
      return [];
    }
    return data ?? [];
  }

  async findById(id: string): Promise<RestaurantDto | null> {
  const { data, error } = await this.supabase
    .rpc('get_restaurant_by_id', { p_restaurant_id: id }); 

  if (error) {
    console.error('Supabase RPC error:', error);
    throw new Error(error.message);
  }

  return data;
}


  
}








