import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {supabase} from '@features/supabase.client';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-invoice',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './edit-invoice.html',
  standalone: true,
  styleUrl: './edit-invoice.css'
})
export class EditInvoice implements OnInit {
  form!: FormGroup;
  invoiceId!: string;
  loading = true;
  saving = false;
  categories: any[] = [];
  users: any[] = [];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, protected router: Router) {}

  async ngOnInit(): Promise<void> {
    this.invoiceId = this.route.snapshot.paramMap.get('id') ?? '';

    const [{ data: invoice }, { data: categories }, { data: users }] = await Promise.all([
      supabase.from('invoices').select('amount, is_incoming, client_name, comment, category_id, user_id').eq('id', this.invoiceId).single(),
      supabase.from('categories').select('id, name'),
      supabase.from('users').select('id, first_name, last_name')
    ]);

    this.categories = categories ?? [];
    this.users = users ?? [];

    this.form = this.fb.group({
      amount: [invoice?.amount ?? 0, [Validators.required, Validators.min(0)]],
      is_incoming: [invoice?.is_incoming ?? true, [Validators.required]],
      client_name: [invoice?.client_name ?? '', [Validators.required]],
      comment: [invoice?.comment ?? ''],
      category_id: [invoice?.category_id ?? '', [Validators.required]],
      user_id: [invoice?.user_id ?? '', [Validators.required]]
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
      .from('invoices')
      .update(this.form.value)
      .eq('id', this.invoiceId);

    this.saving = false;
    if (!error) this.router.navigateByUrl('/admin/invoices');
  }
}
