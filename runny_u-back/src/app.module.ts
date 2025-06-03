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
      host: 'SECRET',
      port: 0,
      username: 'SECRET',
      password: 'SECRET',
      database: 'SECRET',
      entities: [User, Cart, Bill],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CartModule,
    BillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
