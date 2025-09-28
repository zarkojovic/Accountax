import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { supabase } from '@features/supabase.client';
import { FormField } from '@shared/form-field/form-field';
import { InvoiceService } from '@core/services/invoice.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-invoice-modal',
  imports: [ReactiveFormsModule, FormField, NgIf, NgForOf],
  standalone: true,
  templateUrl: './invoice-modal.html',
  styleUrl: './invoice-modal.css'
})
export class InvoiceModal {
  @Input() categories: { id: number; name: string }[] = [];
  @Output() invoiceCreated = new EventEmitter<void>();

  form: FormGroup;
  clientSuggestions: string[] = [];
  filteredClients: string[] = [];

  filterClients(): void {
    const input = this.clientNameControl.value?.toLowerCase() ?? '';
    this.filteredClients = this.clientSuggestions.filter(name =>
      name.toLowerCase().includes(input)
    );
  }

  selectClient(name: string): void {
    this.clientNameControl.setValue(name);
    this.filteredClients = [];
  }

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(3)]],
      clientName: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      dueDate: ['', [Validators.required]],
      incoming: [true],
      categoryId: [null, Validators.required]
    });

    this.loadClientSuggestions();
  }

  get categoryControl(): FormControl { return this.form.get('categoryId') as FormControl; }
  get commentControl(): FormControl { return this.form.get('comment') as FormControl; }
  get clientNameControl(): FormControl { return this.form.get('clientName') as FormControl; }
  get amountControl(): FormControl { return this.form.get('amount') as FormControl; }
  get dueDateControl(): FormControl { return this.form.get('dueDate') as FormControl; }
  get incomingControl(): FormControl { return this.form.get('incoming') as FormControl; }

  async loadClientSuggestions(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('invoices')
      .select('client_name')
      .eq('user_id', userId);

    if (data) {
      const names = data.map(i => i.client_name).filter(Boolean);
      this.clientSuggestions = Array.from(new Set(names));
    }
  }

  async createInvoice(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { clientName, amount, dueDate, incoming, categoryId, comment } = this.form.value;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from('invoices').insert([{
      client_name: clientName,
      amount,
      created_at: dueDate,
      is_incoming: incoming,
      category_id: categoryId,
      user_id: userId,
      comment
    }]);

    if (error) {
      console.error('Failed to insert invoice:', error.message);
      return;
    }

    this.form.reset();
    document.getElementById('invoice-modal')?.click();
    this.invoiceService.triggerRefresh();
    this.invoiceCreated.emit();
  }
}
