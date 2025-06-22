import { Actor } from '../../actors/actors.model';
import { Director } from '../../directors/directors.model';
import { Movie } from '../../movies/movie.model';

export interface ActorApi {
  message: string;
  statusCode: number;
  data: Actor[];
}
export interface ActorApiById {
  message: string;
  statusCode: number;
  data: { actor: Actor; movies: Movie[] };
}
