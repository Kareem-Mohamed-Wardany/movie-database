import { Injectable } from '@angular/core';
import { PaginatedDirectorsResponse } from './directors.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendBaseURL } from '../app.config';
import { ApiResponse } from '../movies/movie.model';

@Injectable({ providedIn: 'root' })
export class DirectorsService {
  constructor(private http: HttpClient) {}

  getDirectors(
    page: number,
    limit: number
  ): Observable<ApiResponse<PaginatedDirectorsResponse>> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<ApiResponse<PaginatedDirectorsResponse>>(
      `${backendBaseURL}/directors`,
      {
        params,
      }
    );
  }
}
