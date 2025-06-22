import { Component, inject, signal, effect, computed } from '@angular/core';
import { DirectorComponent } from './director/director.component';
import { DirectorsService } from './directors.service';
import { Director } from './directors.model';

@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [DirectorComponent],
  templateUrl: './directors.component.html',
  styleUrl: './directors.component.css',
})
export class DirectorsComponent {
  private directorService = inject(DirectorsService);

  currentPage = signal(1);
  pageSize = 3;

  directors = signal<Director[]>([]);
  totalPages = signal(1);

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  constructor() {
    effect(() => {
      const page = this.currentPage(); // 👈 forces dependency
      this.fetchDirectors();
    });
  }

  fetchDirectors() {
    this.directorService
      .getDirectors(this.currentPage(), this.pageSize)
      .subscribe({
        next: (res) => {
          this.directors.set(res.data.directors);
          this.totalPages.set(res.data.totalPages);
        },
        error: (err) => {
          console.error('Failed to fetch directors', err);
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
}
