import { Component, computed } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  constructor(private notificationService: NotificationService) {}
  message = computed(() => this.notificationService.notificationMessage());
  notificationType = computed(() =>
    this.notificationService.notificationType()
  );
}
