import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { AuthService } from '../../auth/auth.service';
import { backendBaseURL } from '../../app.config';
import { catchError, Observable, throwError } from 'rxjs';
import { DirectorApi, DirectorApiById } from './director-api.model';
import { Director } from '../../directors/directors.model';

@Injectable({ providedIn: 'root' })
export class AdminDirectorsService {
  private httpClient = inject(HttpClient);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  getAllDirectors() {
    return this.httpClient
      .get<DirectorApi>(`${backendBaseURL}/admin/directors`, {
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

  addDirector(name: string, birthDate: string, imageFile: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthDate', birthDate);
    formData.append('imageFile', imageFile);
    return this.httpClient
      .post(`${backendBaseURL}/admin/director`, formData, {
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

  deleteDirector(id: string) {
    return this.httpClient
      .delete(`${backendBaseURL}/admin/director/${id}`, {
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

  getDirectorById(id: string) {
    return this.httpClient
      .get<DirectorApiById>(`${backendBaseURL}/directors/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(error.error?.message, 'error');
          return throwError(() => new Error(error.error?.message));
        })
      );
  }

  updateDirector(id: string, formData: FormData) {
    return this.httpClient
      .put(`${backendBaseURL}/admin/director/${id}`, formData, {
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
