import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  Output,
  output,
} from '@angular/core';
import { Movie } from '../movie.model';
import { AuthService } from '../../auth/auth.service';
import { Favorite } from '../../favorites/favorites.model';
import { FavoritesService } from '../../favorites/favorites.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  movie = input.required<Movie>();
  authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  favoritesList = input.required<Favorite[]>();
  isFavorite = computed(() =>
    this.favoritesList().some((f: Favorite) => f.movieId === this.movie().id)
  );

  favorite = computed(() =>
    this.favoritesList().find((f: Favorite) => f.movieId === this.movie().id)
  );

  @Output() favoriteChanged = new EventEmitter<void>();

  onFavorite() {
    const sub = this.favoritesService
      .addMovieToFavoriteList(this.movie().id)
      .subscribe(() => {
        this.favoriteChanged.emit();
        this.notification.show(
          'Movie Added to your favorite list successfully!',
          'success'
        );
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  onUnfavorite() {
    const sub = this.favoritesService
      .deleteMovieFromFavoriteList(this.favorite()!.id)
      .subscribe(() => {
        this.favoriteChanged.emit();
        this.notification.show(
          'Movie Removed from your favorite list successfully!',
          'success'
        );
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
