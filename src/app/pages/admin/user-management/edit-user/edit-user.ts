import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {supabase} from '@features/supabase.client';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-user',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './edit-user.html',
  standalone: true,
  styleUrl: './edit-user.css'
})
export class EditUser implements OnInit {
  form!: FormGroup;
  userId!: string;
  userData: any = null;
  roles: any[] = [];
  imageUrl: string | null = null;
  selectedFile: File | null = null;
  loading = true;
  saving = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, protected router: Router) {}

  async ngOnInit(): Promise<void> {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';

    const [{ data: user }, { data: roles }] = await Promise.all([
      supabase.from('users').select('first_name, last_name, email, company_name, avatar, role_id').eq('id', this.userId).single(),
      supabase.from('roles').select('id, name')
    ]);

    this.userData = user;
    this.roles = roles ?? [];
    this.imageUrl = user?.avatar ?? null;

    this.form = this.fb.group({
      first_name: [user?.first_name ?? '', [Validators.required]],
      last_name: [user?.last_name ?? '', [Validators.required]],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      company_name: [user?.company_name ?? '', [Validators.required]],
      role_id: [user?.role_id ?? '', [Validators.required]]
    });

    this.loading = false;
  }

  handleFileSelection(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFile = file ?? null;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    let avatarUrl = this.imageUrl;

    if (this.selectedFile) {
      const filePath = `avatars/${Date.now()}_${this.selectedFile.name}`;
      await supabase.storage.from('accountax').remove([this.extractPath(this.imageUrl)]);
      const { error: uploadError } = await supabase.storage.from('accountax').upload(filePath, this.selectedFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('accountax').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from('users')
      .update({ ...this.form.value, avatar: avatarUrl })
      .eq('id', this.userId);

    this.saving = false;
    if (!error) this.router.navigateByUrl('/admin/users');
  }

  extractPath(url: string | null): string {
    if (!url) return '';
    const parts = url.split('/');
    const bucketIndex = parts.findIndex(p => p === 'accountax');
    return parts.slice(bucketIndex + 1).join('/');
  }
}
