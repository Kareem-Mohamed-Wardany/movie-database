import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { Favorite } from '../favorites.model';
import { FavoritesService } from '../favorites.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-favorite-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './favorite-card.component.html',
  styleUrl: './favorite-card.component.css',
})
export class FavoriteCardComponent {
  fav = input.required<Favorite>();
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  @Output() onDelete = new EventEmitter<void>();

  onRemove() {
    const sub = this.favoritesService
      .deleteMovieFromFavoriteList(this.fav().id)
      .subscribe(() => {
        this.onDelete.emit();
        this.notification.show(
          'Movie Removed from your favorite list successfully!',
          'success'
        );
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
