import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AdminDirectorsService } from './admin-directors.service';
import { Director } from '../../directors/directors.model';
import { NotificationService } from '../../shared/notification/notification.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-directors',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-directors.component.html',
  styleUrl: './admin-directors.component.css',
})
export class AdminDirectorsComponent {
  private adminDirectorsService = inject(AdminDirectorsService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  private router = inject(Router);

  directors = signal<Director[]>([]); // not just Director
  constructor() {
    const sub = this.adminDirectorsService
      .getAllDirectors()
      .subscribe((res) => {
        this.directors.set(res.data);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onDelete(id: string) {
    const sub = this.adminDirectorsService.deleteDirector(id).subscribe({
      next: () => {
        const updated = this.directors().filter((d) => d.id !== id);
        this.directors.set(updated);
        this.notification.show('Director Deleted Successfully!', 'success');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  onUpdate(directorId: string) {
    this.router.navigate([
      '/admin',
      'directors',
      'update-director',
      directorId,
    ]);
  }
}
