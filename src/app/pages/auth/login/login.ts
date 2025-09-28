import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormField } from '../../../shared/form-field/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  loading = false;
  supabaseError: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  async onSubmit(): Promise<void> {
    this.supabaseError = null;
    this.form.markAllAsTouched();
    this.loading = true;

    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    const { email, password } = this.form.value;
    const { userId, error } = await this.auth.loginUser({ email, password });

    console.log('Login response:', { userId, error });

    if (error || !userId) {
      this.supabaseError = error ?? 'Login failed.';
      this.loading = false;
      return;
    }
    this.loading = false;
    this.form.reset();
    await this.router.navigate(['/']); // or redirect based on role
  }
}
