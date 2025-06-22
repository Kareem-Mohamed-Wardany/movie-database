import { Actor } from '../../actors/actors.model';
import { Movie } from '../../movies/movie.model';

export interface MovieApi {
  message: string;
  statusCode: number;
  data: Movie[];
}
export interface MovieApiById {
  message: string;
  statusCode: number;
  data: { movie: Movie; actors: Actor[] };
}
