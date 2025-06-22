import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/notification/notification.service';
import { AdminDirectorsService } from '../../admin-directors/admin-directors.service';
import { Director } from '../../../directors/directors.model';
import { AdminMoviesService } from '../admin-movies.service';
import { Movie } from '../../../movies/movie.model';

@Component({
  selector: 'app-update-movie',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-movie.component.html',
  styleUrl: './update-movie.component.css',
})
export class UpdateMovieComponent implements OnInit {
  private adminDirectorsService = inject(AdminDirectorsService);
  private adminMovieService = inject(AdminMoviesService);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private currentRoute = inject(ActivatedRoute);

  movieId!: string;
  movie = signal<Movie>({
    id: '',
    title: '',
    description: '',
    genre: '',
    duration: '',
    image: '',
    rate: '',
    directorName: '',
  });

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
    title: new FormControl(this.movie().title, [
      Validators.required,
      Validators.minLength(2),
    ]),
    description: new FormControl(this.movie().description, [
      Validators.required,
    ]),
    genre: new FormControl(this.movie().genre, [Validators.required]),
    duration: new FormControl(this.movie().duration, [
      Validators.required,
      Validators.min(1),
    ]),
    rate: new FormControl(this.movie().rate, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(10),
    ]),
    directorId: new FormControl('', [Validators.required]),
    imageFile: new FormControl<File | null>(null, [Validators.required]),
  });

  constructor() {}
  ngOnInit(): void {
    this.movieId = this.currentRoute.snapshot.paramMap.get('id')!;
    const sub = this.adminDirectorsService
      .getAllDirectors()
      .subscribe((res) => {
        this.directors.set(res.data);
      });
    const sub2 = this.adminMovieService
      .getMovieById(this.movieId!)
      .subscribe((res) => {
        console.log(res.data.movie);
        this.movie.set(res.data.movie);
        this.form.patchValue({
          title: res.data.movie.title,
          description: res.data.movie.description,
          genre: res.data.movie.genre,
          duration: res.data.movie.duration,
          rate: res.data.movie.rate, // Ensure this exists in backend response
          directorId: this.directors().find(
            (d) => d.name === res.data.movie.directorName
          )?.id,
        });

        this.imagePreview = res.data.movie.image;
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.form.value.title!);
    formData.append('description', this.form.value.description!);
    formData.append('genre', this.form.value.genre!);
    formData.append('duration', this.form.value.duration!.toString());
    formData.append('rate', this.form.value.rate!.toString());
    formData.append('directorId', this.form.value.directorId!);
    formData.append('imageFile', this.form.value.imageFile! || '');
    const sub = this.adminMovieService
      .UpdateMovie(this.movieId, formData)
      .subscribe({
        next: () => {
          this.notification.show('Movie Updated Successfully!', 'success');
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
