import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  private router = inject(Router);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9!@#$%^&*_=+-]{8,12}$'),
      ],
    }),
  });
  get emailIsInvalid() {
    return (
      this.form.controls.email.dirty &&
      this.form.controls.email.touched &&
      this.form.controls.email.invalid
    );
  }
  get passwordIsInvalid() {
    return (
      this.form.controls.password.dirty &&
      this.form.controls.password.touched &&
      this.form.controls.password.invalid
    );
  }
  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    const sub = this.authService
      .loginUser(enteredEmail!, enteredPassword!)
      .subscribe({
        next: (user) => {
          console.log(user);
          this.notification.show('Logged in Successfully!', 'success');
          this.router.navigate(['./']);
        },
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
