import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator';

enum MovieType {
  FILM = 'FILM',
  TV_SHOW = 'TV_SHOW',
  VIDEO = 'VIDEO',
  MINI_SERIES = 'MINI_SERIES',
  TV_SERIES = 'TV_SERIES',
  UNKNOWN = 'UNKNOWN',
}

export class CreateMovieDto {
  @IsNumber()
  kinopoiskId: number;

  @IsOptional()
  @IsString()
  imdbId?: string;

  @IsOptional()
  @IsString()
  nameRu?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameOriginal?: string;

  @IsArray()
  @IsString({ each: true })
  countries: string[];

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsOptional()
  @IsNumber()
  ratingKinopoisk?: number;

  @IsOptional()
  @IsNumber()
  ratingImdb?: number;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsEnum(MovieType)
  type: MovieType;

  @IsString()
  posterUrl: string;

  @IsString()
  posterUrlPreview: string;
}
