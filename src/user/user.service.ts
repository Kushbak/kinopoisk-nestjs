import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { handleError } from 'src/utils/error-handler';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const candidate = await this.findByEmail(userData.email);
      if (candidate) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async login(loginData: { email: string; password: string }) {
    try {
      const user = await this.findByEmail(loginData.email);
      if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user.id, email: user.email });
      return { token };
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async getUsers() {
    try {
      return this.userRepository.find();
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return this.userRepository.findOne({
        where: { email },
        relations: ['favoriteMovies'],
      });
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }
}
