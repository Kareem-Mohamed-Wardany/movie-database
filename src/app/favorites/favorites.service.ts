import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { backendBaseURL } from '../app.config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NotificationService } from '../shared/notification/notification.service';
import { Favorite } from './favorites.model';
import { ApiResponse } from '../movies/movie.model';
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  addMovieToFavoriteList(movieId: string) {
    return this.httpClient
      .post(`${backendBaseURL}/favorite/${movieId}`, null, {
        headers: {
          Authorization: `Bearer ${this.authService.user().token}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(error.error?.message, 'error');
          return throwError(() => new Error(error.error?.message));
        })
      );
  }
  getUserFavoritesList(): Observable<Favorite[]> {
    return this.httpClient
      .get<ApiResponse<Favorite[]>>(`${backendBaseURL}/favorite`, {
        headers: {
          Authorization: `Bearer ${this.authService.user().token}`,
        },
      })
      .pipe(
        map((response) => response.data), // Extract the actual favorites array
        catchError((error: HttpErrorResponse) => {
          this.notification.show(
            error.error?.message || 'Failed to load favorites.',
            'error'
          );
          return throwError(
            () => new Error(error.error?.message || 'Failed to load favorites.')
          );
        })
      );
  }
  deleteMovieFromFavoriteList(favoriteId: string) {
    return this.httpClient
      .delete(`${backendBaseURL}/favorite/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${this.authService.user().token}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(error.error?.message, 'error');
          return throwError(() => new Error(error.error?.message));
        })
      );
  }
}
