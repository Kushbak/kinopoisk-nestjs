import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { handleError } from 'src/utils/error-handler';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }

  async login(loginData: { email: string; password: string }) {
    try {
      const user = await this.userService.findByEmail(loginData.email);
      if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      console.log(process.env.JWT_SECRET);

      const token = this.jwtService.sign(
        { id: user.id, email: user.email },
        { secret: process.env.SECRET_KEY },
      );
      return { token };
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }
}
