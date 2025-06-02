import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports:[
    JwtModule.register({
      global:true,
      secret: 'AABBCC',
      signOptions: { expiresIn: '1h' }
    }),
    TypeOrmModule.forFeature([User])
  ]
})
export class AuthModule {}
