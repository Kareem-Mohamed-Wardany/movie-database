import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminDirectorsService } from '../admin-directors.service';
import { NotificationService } from '../../../shared/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-director',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-director.component.html',
  styleUrl: './add-director.component.css',
})
export class AddDirectorComponent {
  private adminDirectorsService = inject(AdminDirectorsService);
  private notification = inject(NotificationService);
  private router = inject(Router);
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
    if (this.form.invalid) return;

    const name = this.form.value.name!;
    const birthDate = this.form.value.birthDate!;
    const imageFile = this.form.value.imageFile!;

    const sub = this.adminDirectorsService
      .addDirector(name, birthDate, imageFile)
      .subscribe({
        next: () => {
          this.notification.show('Director Added Successfully!', 'success');
          this.router.navigate(['./', 'admin', 'directors']);
        },
      }); // Now you can send the data to your service
  }
}
