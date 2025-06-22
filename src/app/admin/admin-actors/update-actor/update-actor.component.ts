import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../shared/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Director } from '../../../directors/directors.model';
import { AdminActorService } from '../admin-actors.service';

@Component({
  selector: 'app-update-actor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-actor.component.html',
  styleUrl: './update-actor.component.css',
})
export class UpdateActorComponent implements OnInit {
  private adminActorsService = inject(AdminActorService);
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
  actorId!: string;
  actor = signal<Director>({
    id: '',
    name: '',
    birthDate: '',
    image: '',
  });
  ngOnInit(): void {
    this.actorId = this.currentRoute.snapshot.paramMap.get('id')!;
    const sub = this.adminActorsService
      .getActorById(this.actorId)
      .subscribe((res) => {
        this.actor.set(res.data.actor);
        this.form.patchValue({
          name: res.data.actor.name,
          birthDate: res.data.actor.birthDate,
        });
        this.imagePreview = res.data.actor.image;
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

    const sub = this.adminActorsService
      .updateActor(this.actorId, formData)
      .subscribe({
        next: () => {
          this.notification.show('Actor Updated Successfully!', 'success');
          this.router.navigate(['./', 'admin', 'actors']);
        },
      }); // Now you can send the data to your service
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
