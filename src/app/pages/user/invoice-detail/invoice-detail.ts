import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {supabase} from '@features/supabase.client';
import {NgIf} from '@angular/common';
import {Location} from '@angular/common';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css',
  imports: [
    NgIf,
    RouterLink
  ]
})
export class InvoiceDetail implements OnInit {
  invoiceId!: string;
  invoice: any = null;
  userId!: string;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  async ngOnInit(): Promise<void> {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    this.userId = session?.user?.id ?? '';

    if (!this.userId) {
      this.notFound = true;
      return;
    }

    await this.fetchInvoiceById(this.invoiceId);
  }


  async fetchInvoiceById(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error || !data || data.user_id !== this.userId) {
      this.notFound = true;
      return;
    }

    this.invoice = data;
  }
}
