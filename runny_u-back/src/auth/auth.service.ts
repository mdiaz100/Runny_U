import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up-request.dto';
import { LoginDto } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (user) {
      const isValidUser = bcrypt.compareSync(loginDto.password, user.password);
      if (!isValidUser) {
        return {
          success: true,
          token: this.userService.getToken(user),
        };
      }
    }
    throw new NotFoundException({ code: '400', detail: 'Invalid credentials' });
  }

  signUp(signUpDto: SignUpDto): Promise<LoginResponse> {
    return this.userService.create({
      email: signUpDto.email!,
      password: signUpDto.password!,
      fullname: signUpDto.fullname,
    });
  }
}
