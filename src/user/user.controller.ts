import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() userData: Partial<User>): Promise<User> {
    const user = await this.userService.findByEmail(userData.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.create(userData);
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }
}
