import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('v1/bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  // src/bill/bill.controller.ts
  @Get('user/:userId')
  getBillsByUser(@Param('userId') userId: string) {
    return this.billService.getBillsByUser(userId);
  }
}
