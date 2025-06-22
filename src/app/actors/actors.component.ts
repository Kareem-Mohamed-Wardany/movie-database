import { Component, inject, signal, effect, computed } from '@angular/core';
import { ActorComponent } from './actor/actor.component';
import { ActorsService } from './actors.service';
import { Actor } from './actors.model';

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [ActorComponent],
  templateUrl: './actors.component.html',
  styleUrl: './actors.component.css',
})
export class ActorsComponent {
  private actorsService = inject(ActorsService);

  currentPage = signal(1);
  pageSize = 3;

  actors = signal<Actor[]>([]);
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
    this.actorsService.getActors(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.actors.set(res.data.actors);
        this.totalPages.set(res.data.totalPages);
      },
      error: (err) => {
        console.error('Failed to fetch actors', err);
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
