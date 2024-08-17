import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/utils/error-handler';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const candidate = await this.findByEmail(createUserDto.email);
      if (candidate) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
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
