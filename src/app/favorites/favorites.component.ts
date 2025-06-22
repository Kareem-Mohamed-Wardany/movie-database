import { Component, effect, inject, signal, DestroyRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MoviesService } from '../movies/movies.service';
import { Favorite } from './favorites.model';
import { FavoritesService } from './favorites.service';
import { FavoriteCardComponent } from './favorite-card/favorite-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [FavoriteCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private movieService = inject(MoviesService);
  authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private DestroyRef = inject(DestroyRef);
  favortieList = signal<Favorite[]>([]);
  constructor() {
    effect(() => {
      const userId = this.authService.user().id;
      if (!userId) return;

      const sub = this.favoritesService.getUserFavoritesList().subscribe({
        next: (favorites: Favorite[]) => {
          console.log('User favorites:', favorites);
          this.favortieList.set(favorites);
        },
        error: (err) => {
          console.error('Failed to fetch favorites:', err);
        },
      });
      this.DestroyRef.onDestroy(() => sub.unsubscribe());
    });
  }
  onChange() {
    const sub = this.favoritesService.getUserFavoritesList().subscribe({
      next: (favorites: Favorite[]) => {
        console.log('User favorites:', favorites);
        this.favortieList.set(favorites);
      },
      error: (err) => {
        console.error('Failed to fetch favorites:', err);
      },
    });
    this.DestroyRef.onDestroy(() => sub.unsubscribe());
  }
}
