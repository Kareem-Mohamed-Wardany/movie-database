import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { backendBaseURL } from '../app.config';
import { AuthUser } from './auth.model';
import { NotificationService } from '../shared/notification/notification.service';

const LOCAL_STORAGE_KEY = 'authUser';
const EXPIRATION_TIME_MS = 60 * 60 * 1000; // 1 hour

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private notification = inject(NotificationService);

  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  private savedUser = this.loadUserFromStorage();
  user = signal<AuthUser>(this.savedUser);

  isLoggedIn = computed(() => this.user().userName !== '');
  isAdmin = computed(() => this.user().roles.includes('Admin'));

  constructor() {
    effect(() => {
      const currentUser = this.user();
      this.saveUserToStorage(currentUser);
      this.setupAutoLogout(currentUser);
    });
  }

  loginUser(email: string, password: string) {
    return this.httpClient
      .post<AuthUser>(`${backendBaseURL}/account/login`, { email, password })
      .pipe(
        tap((user) => {
          this.user.set(user);
        }),
        catchError((error: HttpErrorResponse) => {
          this.notification.show(
            error.error?.message || 'Login failed.',
            'error'
          );
          return throwError(() => new Error('Login failed.'));
        })
      );
  }

  registerUser(
    userName: string,
    email: string,
    password: string,
    phone: string
  ) {
    return this.httpClient
      .post<AuthUser>(`${backendBaseURL}/account/register`, {
        userName,
        email,
        phone,
        password,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notification.show(
            error.error?.message || 'Registration failed.',
            'error'
          );
          return throwError(() => new Error('Registration failed.'));
        })
      );
  }

  logout() {
    this.user.set(this.getEmptyUser());
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.notification.show('Logged Out Successfully.', 'success');
  }

  // 🔒 Helpers

  private setupAutoLogout(user: AuthUser) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    if (!user || !user.token) return;

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;

    try {
      const { timestamp } = JSON.parse(raw);
      const remainingTime = EXPIRATION_TIME_MS - (Date.now() - timestamp);

      if (remainingTime <= 0) {
        this.logout();
      } else {
        this.logoutTimer = setTimeout(() => {
          this.logout();
          this.notification.show(
            'Session expired. You were logged out.',
            'info'
          );
        }, remainingTime);
      }
    } catch {
      this.logout(); // fallback
    }
  }

  private loadUserFromStorage(): AuthUser {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      if (!raw) return this.getEmptyUser();

      const parsed = JSON.parse(raw) as { user: AuthUser; timestamp: number };
      const now = Date.now();

      if (now - parsed.timestamp > EXPIRATION_TIME_MS) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return this.getEmptyUser();
      }

      return parsed.user;
    } catch {
      return this.getEmptyUser();
    }
  }

  private saveUserToStorage(user: AuthUser) {
    if (!user || !user.token) return;

    const data = {
      user,
      timestamp: Date.now(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  private getEmptyUser(): AuthUser {
    return {
      id: '',
      userName: '',
      email: '',
      token: '',
      roles: [],
    };
  }
}
