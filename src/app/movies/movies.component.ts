import { Component, inject, signal, effect, computed } from '@angular/core';
import { Movie } from './movie.model';
import { MovieComponent } from './movie/movie.component';
import { MoviesService } from './movies.service';
import { AuthService } from '../auth/auth.service';
import { FavoritesService } from '../favorites/favorites.service';
import { Favorite } from '../favorites/favorites.model';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [MovieComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent {
  private movieService = inject(MoviesService);
  authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  favortieList = signal<Favorite[]>([]);
  currentPage = signal(1);
  pageSize = 3;

  movies = signal<Movie[]>([]);
  totalPages = signal(1);

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  constructor() {
    effect(() => {
      const page = this.currentPage(); // 👈 forces dependency
      this.fetchMovies();

      const userId = this.authService.user().id;
      if (!userId) return;

      this.favoritesService.getUserFavoritesList().subscribe({
        next: (favorites: Favorite[]) => {
          console.log('User favorites:', favorites);
          this.favortieList.set(favorites);
        },
        error: (err) => {
          console.error('Failed to fetch favorites:', err);
        },
      });
    });
  }

  fetchMovies() {
    this.movieService.getMovies(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.movies.set(res.data.movies);
        this.totalPages.set(res.data.totalPages);
      },
      error: (err) => {
        console.error('Failed to fetch movies', err);
      },
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((n) => n + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((n) => n - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onChange() {
    this.favoritesService.getUserFavoritesList().subscribe({
      next: (favorites: Favorite[]) => {
        console.log('User favorites:', favorites);
        this.favortieList.set(favorites);
      },
      error: (err) => {
        console.error('Failed to fetch favorites:', err);
      },
    });
  }
}
