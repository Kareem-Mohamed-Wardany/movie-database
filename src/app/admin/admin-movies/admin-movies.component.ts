import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Director } from '../../directors/directors.model';
import { NotificationService } from '../../shared/notification/notification.service';
import { AdminDirectorsService } from '../admin-directors/admin-directors.service';
import { Router, RouterLink } from '@angular/router';
import { Movie } from '../../movies/movie.model';
import { AdminMoviesService } from './admin-movies.service';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-movies.component.html',
  styleUrl: './admin-movies.component.css',
})
export class AdminMoviesComponent {
  private adminMoviesService = inject(AdminMoviesService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  private router = inject(Router);
  movies = signal<Movie[]>([]); // not just Director
  constructor() {
    const sub = this.adminMoviesService.getAllMovies().subscribe((res) => {
      this.movies.set(res.data);
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onDelete(id: string) {
    const sub = this.adminMoviesService.deletMovie(id).subscribe({
      next: () => {
        const updated = this.movies().filter((m) => m.id !== id);
        this.movies.set(updated);
        this.notification.show('Movie Deleted Successfully!', 'success');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  onUpdate(movieId: string) {
    this.router.navigate(['/admin', 'movies', 'update-movie', movieId]);
  }
}
