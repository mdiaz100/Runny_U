import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-request.dto';
import { SignUpDto } from './dto/sign-up-request.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto:SignUpDto){
    return this.authService.signUp(signUpDto);
  }

}
