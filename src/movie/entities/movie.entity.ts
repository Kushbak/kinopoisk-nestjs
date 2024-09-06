import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum MovieType {
  FILM = 'FILM',
  TV_SHOW = 'TV_SHOW',
  VIDEO = 'VIDEO',
  MINI_SERIES = 'MINI_SERIES',
  TV_SERIES = 'TV_SERIES',
  UNKNOWN = 'UNKNOWN',
}

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  kinopoiskId: number;

  @Column({ type: 'varchar', nullable: true })
  imdbId?: string;

  @Column({ type: 'varchar', nullable: true })
  nameRu?: string;

  @Column({ type: 'varchar', nullable: true })
  nameEn?: string;

  @Column({ type: 'varchar', nullable: true })
  nameOriginal?: string;

  @Column({ type: 'text', array: true })
  countries: string[];

  @Column({ type: 'text', array: true })
  genres: string[];

  @Column({ type: 'float', nullable: true })
  ratingKinopoisk?: number;

  @Column({ type: 'float', nullable: true })
  ratingImdb?: number;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @Column({ type: 'enum', enum: MovieType })
  type: MovieType;

  @Column({ type: 'varchar' })
  posterUrl: string;

  @Column({ type: 'varchar' })
  posterUrlPreview: string;
}
