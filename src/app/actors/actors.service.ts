import { Injectable } from '@angular/core';
import { PaginatedActorssResponse } from './actors.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendBaseURL } from '../app.config';
import { ApiResponse } from '../movies/movie.model';

@Injectable({ providedIn: 'root' })
export class ActorsService {
  constructor(private http: HttpClient) {}

  getActors(
    page: number,
    limit: number
  ): Observable<ApiResponse<PaginatedActorssResponse>> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<ApiResponse<PaginatedActorssResponse>>(
      `${backendBaseURL}/actors`,
      {
        params,
      }
    );
  }
}
