import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NotificationService } from '../../shared/notification/notification.service';
import { Router, RouterLink } from '@angular/router';
import { AdminActorService } from './admin-actors.service';
import { Actor } from '../../actors/actors.model';

@Component({
  selector: 'app-admin-actors',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-actors.component.html',
  styleUrl: './admin-actors.component.css',
})
export class AdminActorsComponent {
  private adminActorService = inject(AdminActorService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  private router = inject(Router);

  actors = signal<Actor[]>([]); // not just Director
  constructor() {
    const sub = this.adminActorService.getAllActors().subscribe((res) => {
      this.actors.set(res.data);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onDelete(id: string) {
    const sub = this.adminActorService.deleteActor(id).subscribe({
      next: () => {
        const updated = this.actors().filter((d) => d.id !== id);
        this.actors.set(updated);
        this.notification.show('Actor Deleted Successfully!', 'success');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  onUpdate(actorId: string) {
    this.router.navigate(['/admin', 'actors', 'update-actor', actorId]);
  }
}
