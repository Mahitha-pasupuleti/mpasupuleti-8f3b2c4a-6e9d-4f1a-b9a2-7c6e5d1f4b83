import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from '@ngtestwrk/data';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    return this.authService.login(email);
  }

  @Post('register') // NEW: create user endpoint
  async register(@Body() user: UserDTO) {
    return this.authService.createUser(user);
  }
}