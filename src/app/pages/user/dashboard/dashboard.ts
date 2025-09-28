import {Component, OnInit} from '@angular/core';
import {FormField} from '@shared/form-field/form-field';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {supabase} from '@features/supabase.client';
import {InvoiceTypePipe} from '@core/pipes/invoice-type.pipe';
import {CurrencyTypePipe} from '@core/pipes/currency-type.pipe';
import {TimeFormatPipe} from '@core/pipes/time-format.pipe';
import {BaseChartDirective} from 'ng2-charts';
import {BarChartComponent} from '@shared/bar-chart/bar-chart';
import {InvoiceService} from '@core/services/invoice.service';
import {ProfitChart} from '@features/pages/user/dashboard/profit-chart/profit-chart';
import {RouterLink} from '@angular/router';
import {InvoiceModal} from '@shared/invoice-modal/invoice-modal';

@Component({
  selector: 'app-dashboard',
  imports: [FormField, ReactiveFormsModule, InvoiceTypePipe, CurrencyTypePipe, TimeFormatPipe, BaseChartDirective, BarChartComponent, ProfitChart, RouterLink, InvoiceModal],
  templateUrl: './dashboard.html',
  standalone: true,
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  form: FormGroup;
  protected readonly document = document;
  categories: { id: number; name: string }[] = [];
  invoices: any[] = [];
  async ngOnInit(): Promise<void> {
    await this.fetchCategories();
    await this.fetchInvoices();
  }

  async fetchCategories(): Promise<void> {
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name');

    if (categoryData) this.categories = categoryData;
  }

  async fetchInvoices(): Promise<void> {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    console.log('Fetched invoices:', invoiceData);
    if (invoiceData) {
      this.invoices = invoiceData;
    }
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
  }

  get categoryControl(): FormControl {
    return this.form.get('categoryId') as FormControl;
  }

  get commentControl(): FormControl {
    return this.form.get('comment') as FormControl;
  }

  get clientNameControl(): FormControl {
    return this.form.get('clientName') as FormControl;
  }

  get amountControl(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  get dueDateControl(): FormControl {
    return this.form.get('dueDate') as FormControl;
  }

  get incomingControl(): FormControl {
    return this.form.get('incoming') as FormControl;
  }

  async createInvoice(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {clientName, amount, dueDate, incoming, categoryId, comment} = this.form.value;

    // Get current user from Supabase session
    const {
      data: {session},
      error: sessionError
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      return;
    }

    console.log('Form Values:', this.form.value);

    const {data, error} = await supabase.from('invoices').insert([
      {
        client_name: clientName,
        amount,
        created_at: dueDate,
        is_incoming: incoming,
        category_id: categoryId,
        user_id: userId,
        comment: comment
      }
    ]);

    if (error) {
      console.error('Failed to insert invoice:', error.message);
      return;
    }

    this.form.reset();
    document.getElementById('invoice-modal')?.click();
    await this.fetchInvoices();
    this.invoiceService.triggerRefresh();
  }
}
