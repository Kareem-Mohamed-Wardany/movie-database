import { Injectable, signal } from '@angular/core';
import { dummy } from './dummy';
import { ApiResponse, Movie, PaginatedMoviesResponse } from './movie.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendBaseURL } from '../app.config';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(private http: HttpClient) {}

  getMovies(
    page: number,
    limit: number
  ): Observable<ApiResponse<PaginatedMoviesResponse>> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<ApiResponse<PaginatedMoviesResponse>>(
      `${backendBaseURL}/movies`,
      {
        params,
      }
    );
  }
}
