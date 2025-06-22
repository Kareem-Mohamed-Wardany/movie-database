import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { AuthService } from '../../auth/auth.service';
import { backendBaseURL } from '../../app.config';
import { catchError, throwError } from 'rxjs';
import { ActorApi, ActorApiById } from './actor-api.model';

@Injectable({ providedIn: 'root' })
export class AdminActorService {
  private httpClient = inject(HttpClient);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  getAllActors() {
    return this.httpClient
      .get<ActorApi>(`${backendBaseURL}/admin/actors`, {
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

  addActor(name: string, birthDate: string, imageFile: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthDate', birthDate);
    formData.append('imageFile', imageFile);
    return this.httpClient
      .post(`${backendBaseURL}/admin/actor`, formData, {
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

  deleteActor(id: string) {
    return this.httpClient
      .delete(`${backendBaseURL}/admin/actor/${id}`, {
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

  getActorById(id: string) {
    return this.httpClient
      .get<ActorApiById>(`${backendBaseURL}/actors/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(error.error?.message, 'error');
          return throwError(() => new Error(error.error?.message));
        })
      );
  }

  updateActor(id: string, formData: FormData) {
    return this.httpClient
      .put(`${backendBaseURL}/admin/actor/${id}`, formData, {
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
