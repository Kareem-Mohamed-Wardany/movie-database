import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { AuthService } from '../../auth/auth.service';
import { backendBaseURL } from '../../app.config';
import { catchError, throwError } from 'rxjs';
import { MovieApi, MovieApiById } from './movie-api.model';
import { MovieFormData } from '../../movies/movie.model';

@Injectable({ providedIn: 'root' })
export class AdminMoviesService {
  private httpClient = inject(HttpClient);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  getAllMovies() {
    return this.httpClient
      .get<MovieApi>(`${backendBaseURL}/admin/movies`, {
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

  getMovieById(id: string) {
    return this.httpClient
      .get<MovieApiById>(`${backendBaseURL}/movies/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(error.error?.message, 'error');
          return throwError(() => new Error(error.error?.message));
        })
      );
  }

  addMovie(formData: FormData) {
    return this.httpClient
      .post(`${backendBaseURL}/admin/movie`, formData, {
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
  UpdateMovie(id: string, formData: FormData) {
    return this.httpClient
      .put(`${backendBaseURL}/admin/movie/${id}`, formData, {
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

  deletMovie(id: string) {
    return this.httpClient
      .delete(`${backendBaseURL}/admin/movie/${id}`, {
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
