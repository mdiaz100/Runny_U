import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = createUserDto;
      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = this.userRepository.create({
        password: passwordHash,
        ...user
      });
      const userDB = await this.userRepository.save(newUser);
      return {
        success: true,
        token: this.getToken(userDB)
      }
    } catch (error) {
      throw new BadRequestException({code:error.code, detail:error.detail})
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getToken(user: User) {
    const { password: _, ...userPayload } = user;
    return this.jwtService.sign(userPayload);
  }
}
