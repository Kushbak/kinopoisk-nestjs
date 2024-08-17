import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    return this.userService.login(loginData);
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }
}
