import { Controller, Get, Param } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantsService: RestaurantService) {}

  @Get()
  async findAll(): Promise<RestaurantDto[]> {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RestaurantDto | null> {
    return this.restaurantsService.findById(id);
  }
}

