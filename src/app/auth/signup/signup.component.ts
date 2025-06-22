import { Component, DestroyRef, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isValuesEqual } from '../../../../isValueEqual';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NotificationService);
  private router = inject(Router);
  form = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    emails: new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        confirmEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
      },
      [isValuesEqual('email', 'confirmEmail')]
    ),
    passwords: new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9!@#$%^&*_=+-]{8,12}$'),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9!@#$%^&*_=+-]{8,12}$'),
        ]),
      },
      [isValuesEqual('password', 'confirmPassword')]
    ),
    phone: new FormControl('', [Validators.pattern('^\\+?[0-9]{10,15}$')]),
  });
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const enteredEmail = this.form.value.emails?.email;
    const enteredPassword = this.form.value.passwords?.password;
    const enteredUserName = this.form.value.userName;
    const enteredPhone = this.form.value.phone;
    const sub = this.authService
      .registerUser(
        enteredUserName!,
        enteredEmail!,
        enteredPassword!,
        enteredPhone!
      )
      .subscribe({
        next: () => {
          this.notification.show('Registered Successfully!', 'success');
          this.router.navigate(['./auth', 'login']);
        },
        error: (err) => {
          this.notification.show(
            err?.error?.message || 'Registration failed.',
            'error'
          );
        },
      });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
