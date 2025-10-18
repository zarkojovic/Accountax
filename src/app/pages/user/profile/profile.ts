import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {supabase} from '@features/supabase.client';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './profile.html',
  standalone: true,
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  form!: FormGroup;
  userId!: string;
  loading = true;
  success = false;
  editMode = false;
  userData: any = null;
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  saving = false;
  showToast = false;
  toastMessage = '';
  previousImagePath: string | null = null;

  handleFileSelection(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile = file ?? null;
  }
  constructor(private fb: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    this.userId = session?.user?.id ?? '';

    const { data, error } = await supabase
      .from('users')
      .select('first_name, last_name, email, company_name, avatar')
      .eq('id', this.userId)
      .single();

    const avatarUrl = data?.avatar ?? null;
    this.imageUrl = avatarUrl;

    if (avatarUrl) {
      const parts = avatarUrl.split('/');
      const bucketIndex = parts.findIndex((p: string) => p === 'accountax');
      this.previousImagePath = parts.slice(bucketIndex + 1).join('/');
    }

    this.userData = data;
    this.imageUrl = data?.avatar ?? null;

    this.form = this.fb.group({
      first_name: [data?.first_name ?? '', [Validators.required, Validators.minLength(3)]],
      last_name: [data?.last_name ?? '', [Validators.required, Validators.minLength(3)]],
      email: [data?.email ?? '', [Validators.required, Validators.email]],
      company_name: [data?.company_name ?? '', [Validators.required, Validators.minLength(2)]]
    });

    this.loading = false;
  }

  get firstNameControl(): FormControl {
    return this.form.get('first_name') as FormControl;
  }
  get lastNameControl(): FormControl {
    return this.form.get('last_name') as FormControl;
  }
  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }
  get companyNameControl(): FormControl {
    return this.form.get('company_name') as FormControl;
  }

  async updateProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    let imageUrl: string | null = null;

    if (this.selectedFile) {
      // Delete previous image if it exists
      if (this.previousImagePath) {
        const { error: deleteError } = await supabase.storage
          .from('accountax')
          .remove([this.previousImagePath]);

        if (deleteError) {
          console.warn('Failed to delete previous image:', deleteError.message);
        }
      }

      const filePath = `avatars/${Date.now()}_${this.selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('accountax')
        .upload(filePath, this.selectedFile);

      if (uploadError) {
        console.error('Upload failed:', uploadError.message);
        this.saving = false;
        return;
      }

      const { data } = supabase.storage
        .from('accountax')
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;

      // Update previousImagePath for future deletes
      const parts = imageUrl.split('/');
      const bucketIndex = parts.findIndex((p: string) => p === 'accountax');
      this.previousImagePath = parts.slice(bucketIndex + 1).join('/');
    }


    const { first_name, last_name, email, company_name } = this.form.value;

    const { error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        email,
        company_name,
        avatar: imageUrl
      })
      .eq('id', this.userId);

    this.success = !error;
    this.editMode = false;
    this.saving = false;

    if (!error) {
      this.toastMessage = 'Profile updated successfully!';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);

      this.userData = {
        ...this.userData,
        first_name,
        last_name,
        email,
        company_name,
        avatar: imageUrl ?? this.userData.avatar
      };

      this.imageUrl = `${this.userData.avatar}?t=${Date.now()}`;
    }

  }
}
