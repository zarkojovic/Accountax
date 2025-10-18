import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {supabase} from '@features/supabase.client';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-category',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './edit-category.html',
  standalone: true,
  styleUrl: './edit-category.css'
})
export class EditCategory implements OnInit {
  form!: FormGroup;
  categoryId!: string;
  loading = true;
  saving = false;
  errorMessage = '';
  success = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, protected router: Router) {}

  async ngOnInit(): Promise<void> {
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? '';

    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', this.categoryId)
      .single();

    if (error || !data) {
      this.errorMessage = 'Failed to load category.';
      this.loading = false;
      return;
    }

    this.form = this.fb.group({
      name: [data.name ?? '', [Validators.required, Validators.minLength(2)]]
    });

    this.loading = false;
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const { error } = await supabase
      .from('categories')
      .update({ name: this.form.value.name })
      .eq('id', this.categoryId);

    this.saving = false;

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.success = true;
      setTimeout(() => this.router.navigateByUrl('/admin/categories'), 1500);
    }
  }
}
