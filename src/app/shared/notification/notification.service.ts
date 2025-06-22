// notification.service.ts
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notificationMessage = signal<string | null>(null);
  notificationType = signal<'success' | 'error' | 'info' | null>(null);

  show(
    message: string,
    type: 'success' | 'error' | 'info' | null,
    timeout = 3000
  ) {
    this.notificationMessage.set(message);
    this.notificationType.set(type);
    setTimeout(() => {
      this.notificationMessage.set(null);
      this.notificationType.set(null);
    }, timeout);
  }
}
