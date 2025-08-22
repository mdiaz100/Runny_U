import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

@Injectable()
export class RestaurantService {
  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
 );

  async findAll(): Promise<any[]> {
    const { data, error } = await this.supabase.rpc('get_restaurants_with_menu');

    if (error) {
      console.error('Supabase RPC error:', error);
      return [];
    }
    return data ?? [];
  }

  async findById(id: string): Promise<any> {
  const { data, error } = await this.supabase
    .rpc('get_restaurant_by_id', { p_restaurant_id: id }); 

  if (error) {
    console.error('Supabase RPC error:', error);
    throw new Error(error.message);
  }

  return data;
}


  
}








