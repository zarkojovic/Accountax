import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {supabase} from '@features/supabase.client';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, NgClass, CurrencyPipe, RouterLink],
  templateUrl: './invoice-management.html',
  styleUrl: './invoice-management.css'
})
export class InvoiceManagement implements OnInit {
  invoices: any[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  async ngOnInit(): Promise<void> {
    await this.fetchInvoices();
    this.loading = false;
  }

  async fetchInvoices(): Promise<void> {
    const {data, error} = await supabase
      .from('invoices')
      .select(`
        id,
        amount,
        is_incoming,
        client_name,
        comment,
        created_at,
        category: categories ( id, name ),
        user: users ( id, first_name, last_name )
      `)
      .order('created_at', {ascending: false});

    if (data) {
      this.invoices = data;
      this.totalPages = Math.ceil(this.invoices.length / this.pageSize);
    }
  }

  get paginated(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.invoices.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  async deleteInvoice(id: string): Promise<void> {
    const confirmed = confirm('Delete this invoice?');
    if (!confirmed) return;

    const {error} = await supabase.from('invoices').delete().eq('id', id);
    if (!error) {
      await this.fetchInvoices();
    }
  }
}
