import { Director } from '../../directors/directors.model';
import { Movie } from '../../movies/movie.model';

export interface DirectorApi {
  message: string;
  statusCode: number;
  data: Director[];
}
export interface DirectorApiById {
  message: string;
  statusCode: number;
  data: { director: Director; movies: Movie[] };
}
