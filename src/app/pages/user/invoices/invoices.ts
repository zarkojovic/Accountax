import {Component, OnInit} from '@angular/core';
import {supabase} from '@features/supabase.client';
import {RouterLink} from '@angular/router';
import {InvoiceTypePipe} from '@core/pipes/invoice-type.pipe';
import {CurrencyTypePipe} from '@core/pipes/currency-type.pipe';
import {TimeFormatPipe} from '@core/pipes/time-format.pipe';
import {InvoiceModal} from '@shared/invoice-modal/invoice-modal';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {InvoiceService} from '@core/services/invoice.service';

@Component({
  selector: 'app-invoices',
  imports: [
    RouterLink,
    CurrencyTypePipe,
    TimeFormatPipe,
    InvoiceTypePipe,
    InvoiceModal,
    FormsModule,
    NgIf
  ],
  standalone: true,
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  paginatedInvoices: any[] = [];
  categories: { id: number; name: string }[] = [];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  filterClient: string = '';
  filterCategory: string = '';
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;


  constructor(private invoiceService: InvoiceService) {
    this.invoiceService.refresh$.subscribe(async () => {
      this.loading = true;
      await this.fetchInvoices();
      await this.applyFilters();
      this.loading = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.fetchCategories();
    await this.fetchInvoices();
    await this.applyFilters();
    this.loading = false;
  }

  async fetchCategories(): Promise<void> {
    const { data } = await supabase.from('categories').select('id, name');
    if (data) this.categories = data;
  }

  async fetchInvoices(): Promise<void> {
    const { data } = await supabase
      .from('invoices')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (data) {
      this.invoices = data;
      this.totalPages = Math.ceil(this.invoices.length / this.pageSize);
      this.updatePaginatedInvoices();
    }
  }

  toastMessage = '';
  showToast = false;

  async deleteInvoice(id: number): Promise<void> {
    const confirmed = confirm('Are you sure you want to delete this invoice?');
    if (!confirmed) return;

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete invoice:', error.message);
      this.toastMessage = 'Failed to delete invoice.';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
      return;
    }

    this.toastMessage = 'Invoice deleted successfully!';
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);

    await this.fetchInvoices();
    await this.applyFilters();
  }
  updatePaginatedInvoices(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedInvoices = this.filteredInvoices.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedInvoices();
  }

  applyFilters(): void {
    let filtered = [...this.invoices];

    if (this.filterClient) {
      filtered = filtered.filter(i =>
        i.client_name?.toLowerCase().includes(this.filterClient.toLowerCase())
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter(i =>
        i.categories?.name === this.filterCategory
      );
    }

    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const valA = this.resolveSortValue(a, this.sortColumn);
        const valB = this.resolveSortValue(b, this.sortColumn);

        return this.sortDirection === 'asc'
          ? valA > valB ? 1 : -1
          : valA < valB ? 1 : -1;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    this.currentPage = 1;
    this.filteredInvoices = filtered;
    this.updatePaginatedInvoices();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  resolveSortValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

}
