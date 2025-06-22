import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminDirectorsService } from '../admin-directors.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../../movies/movie.model';
import { Director } from '../../../directors/directors.model';

@Component({
  selector: 'app-update-director',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-director.component.html',
  styleUrl: './update-director.component.css',
})
export class UpdateDirectorComponent implements OnInit {
  private adminDirectorsService = inject(AdminDirectorsService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private currentRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  imagePreview: string | null = null;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
    ]),
    birthDate: new FormControl('', Validators.required),
    imageFile: new FormControl<File | null>(null, Validators.required),
  });
  directorId!: string;
  director = signal<Director>({
    id: '',
    name: '',
    birthDate: '',
    image: '',
  });
  ngOnInit(): void {
    this.directorId = this.currentRoute.snapshot.paramMap.get('id')!;
    const sub = this.adminDirectorsService
      .getDirectorById(this.directorId)
      .subscribe((res) => {
        this.director.set(res.data.director);
        this.form.patchValue({
          name: res.data.director.name,
          birthDate: res.data.director.birthDate,
        });
        this.imagePreview = res.data.director.image;
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ imageFile: file });
      this.form.get('imageFile')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const name = this.form.value.name!;
    const birthDate = this.form.value.birthDate!;
    const imageFile = this.form.value.imageFile!;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthDate', birthDate);
    formData.append('imageFile', imageFile);

    const sub = this.adminDirectorsService
      .updateDirector(this.directorId, formData)
      .subscribe({
        next: () => {
          this.notification.show('Director Updated Successfully!', 'success');
          this.router.navigate(['./', 'admin', 'directors']);
        },
      }); // Now you can send the data to your service
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
