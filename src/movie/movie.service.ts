import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async createList(moviesList: CreateMovieDto[]) {
    const newMovies = [];
    for (let i = 0; i < moviesList.length; i++) {
      const newMovie = this.movieRepository.create();
      Object.assign(newMovie, this.modifyMovie(moviesList[i]));
      newMovies.push(newMovie);
    }

    await this.movieRepository.save(newMovies);
    return newMovies;
  }

  async create(createMovieDto: CreateMovieDto) {
    const newMovie = this.movieRepository.create();
    Object.assign(newMovie, createMovieDto);
    await this.movieRepository.save(newMovie);
    return newMovie;
  }

  async findAll() {
    return await this.movieRepository.find();
  }

  async findOne(id: number) {
    return await this.movieRepository.findOne({ where: { id } });
  }

  private modifyMovie(movie: any): CreateMovieDto {
    return {
      ...movie,
      genres: movie.genres.map((item: { genre: string }) => item.genre),
      countries: movie.countries.map(
        (item: { country: string }) => item.country,
      ),
    };
  }
}
