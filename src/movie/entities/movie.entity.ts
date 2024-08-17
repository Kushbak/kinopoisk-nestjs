import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { array: true })
  countries: string[];

  @Column('text', { array: true })
  genres: string[];

  @Column({ type: 'float' })
  ratingKinopoisk: number;

  @Column({ type: 'float' })
  ratingImdb: number;

  @Column()
  year: number;

  @Column({ type: 'enum', enum: ['film', 'tv series'] })
  type: 'film' | 'tv series';

  @Column()
  posterUrl: string;

  @Column()
  posterUrlPreview: string;
}
