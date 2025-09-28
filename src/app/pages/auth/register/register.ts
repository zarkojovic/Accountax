import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormField} from '../../../shared/form-field/form-field';
import {Router, RouterLink} from '@angular/router';
import {supabase} from '../../../supabase.client';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form: FormGroup;
  public loading = false;
  public supabaseError: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      firstName: ['',[Validators.required, Validators.minLength(3)]],
      lastName: ['',[Validators.required, Validators.minLength(3)]],
      companyName: ['',[Validators.required, Validators.minLength(3)]],
      companyNumber: ['',[Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(8)]],
    });
  }

  get firstNameControl(): FormControl {
    return this.form.get('firstName') as FormControl;
  }
  get lastNameControl(): FormControl {
    return this.form.get('lastName') as FormControl;
  }
  get companyNameControl(): FormControl {
    return this.form.get('companyName') as FormControl;
  }
  get companyNumberControl(): FormControl {
    return this.form.get('companyNumber') as FormControl;
  }
  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }
  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  async onSubmit(): Promise<void> {
    this.supabaseError = null;
    this.form.markAllAsTouched();
    this.loading = true;

    if (this.form.invalid) {
      this.loading = false;
      return;
    }

    const { email, password, firstName, lastName, companyName, companyNumber } = this.form.value;

    const { userId, error: authError } = await this.auth.registerUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      company_id: companyNumber
    });

    if (authError || !userId) {
      this.supabaseError = authError ?? 'User ID missing after registration.';
      this.loading = false;
      return;
    }

    const { error: insertError } = await this.auth.insertUserProfile({
      userId: userId, profile: {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        company_id: companyNumber,
        email
      }
    });

    if (insertError) {
      this.supabaseError = insertError;
      this.loading = false;
      return;
    }

    this.loading = false;
    this.form.reset();
    await this.router.navigate(['/auth/login']);
  }

}
