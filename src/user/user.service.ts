import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/utils/error-handler';
import { CreateUserDto } from './dto/create-user.dto';
import { Movie } from 'src/movie/entities/movie.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
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
      return await this.userRepository.save(user);
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async getUsers() {
    try {
      return await this.userRepository.find({
        select: ['email', 'favoriteMovies', 'firstName', 'id', 'lastName'],
      });
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async findById(id: number) {
    try {
      const candidate = await this.userRepository.findOne({
        where: { id },
        relations: ['favoriteMovies'],
      });

      if (!candidate) {
        throw new BadRequestException('User not found');
      }

      delete candidate.password;
      return candidate;
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const candidate = await this.userRepository.findOne({
        where: { email },
        relations: ['favoriteMovies'],
      });

      if (!candidate) {
        throw new BadRequestException('User not found');
      }

      delete candidate.password;
      return candidate;
    } catch (e) {
      handleError('[UserModule]', e);
    }
  }

  async addMovieToFavorites(userId: number, movieId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteMovies'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with id ${movieId} not found`);
    }

    user.favoriteMovies.push(movie);
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async removeMovieFromFavorites(userId: number, movieId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteMovies'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const movieIndex = user.favoriteMovies.findIndex(
      (movie) => movie.id === movieId,
    );

    if (movieIndex === -1) {
      throw new NotFoundException(
        `Movie with id ${movieId} is not in favorites`,
      );
    }

    user.favoriteMovies.splice(movieIndex, 1);
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }
}
