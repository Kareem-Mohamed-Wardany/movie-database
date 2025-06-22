import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { AdminDirectorsService } from '../../admin-directors/admin-directors.service';
import { Director } from '../../../directors/directors.model';
import { AdminMoviesService } from '../admin-movies.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css',
})
export class AddMovieComponent {
  private adminDirectorsService = inject(AdminDirectorsService);
  private adminMovieService = inject(AdminMoviesService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  directors = signal<Director[]>([]);
  genres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'SciFi',
    'Romance',
    'Thriller',
    'Fantasy',
    'Documentary',
    'Animation',
    'Adventure',
    'Mystery',
  ];
  imagePreview: string | ArrayBuffer | null = null;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required, Validators.min(1)]),
    rate: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(10),
    ]),
    directorId: new FormControl('', [Validators.required]),
    imageFile: new FormControl<File | null>(null, [Validators.required]),
  });

  constructor() {
    const sub = this.adminDirectorsService
      .getAllDirectors()
      .subscribe((res) => {
        this.directors.set(res.data);
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('title', this.form.value.title!);
    formData.append('description', this.form.value.description!);
    formData.append('genre', this.form.value.genre!);
    formData.append('duration', this.form.value.duration!.toString());
    formData.append('rate', this.form.value.rate!.toString());
    formData.append('directorId', this.form.value.directorId!);
    formData.append('imageFile', this.form.value.imageFile!);
    const sub = this.adminMovieService.addMovie(formData).subscribe({
      next: () => {
        this.notification.show('Movie Added Successfully!', 'success');
        this.router.navigate(['/admin/movies']);
      },
    });
    // Here you would call your movie service to submit the data
  }
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.form.patchValue({ imageFile: file });
    this.form.get('imageFile')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
