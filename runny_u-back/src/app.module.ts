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
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Cart, Bill],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    CartModule,
    BillModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
