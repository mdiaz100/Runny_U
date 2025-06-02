import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Cart } from './cart/entities/cart.entity';
import { Bill } from './bill/entities/bill.entity';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-us-west-1.pooler.supabase.com',
      port: 6543,
      username: 'postgres.dflnygstfmekkrkdcvtb',
      password: 'Ecmm8juosi9eQSzH',
      database: 'postgres',
      entities: [User, Cart, Bill],
      synchronize: true, 
    }),
    AuthModule, UserModule, CartModule, BillModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
