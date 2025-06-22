import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../shared/notification/notification.service';
import { Router } from '@angular/router';
import { AdminActorService } from '../admin-actors.service';

@Component({
  selector: 'app-add-actor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-actor.component.html',
  styleUrl: './add-actor.component.css',
})
export class AddActorComponent {
  private adminActorService = inject(AdminActorService);
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

    const sub = this.adminActorService
      .addActor(name, birthDate, imageFile)
      .subscribe({
        next: () => {
          this.notification.show('Actor Added Successfully!', 'success');
          this.router.navigate(['./', 'admin', 'actors']);
        },
      }); // Now you can send the data to your service
  }
}
