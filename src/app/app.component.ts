import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ErrorService } from './shared/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { NotificationComponent } from './shared/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    ErrorModalComponent,
    NotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'movie-database';
  private errorService = inject(ErrorService);
  error = this.errorService.error;
}
