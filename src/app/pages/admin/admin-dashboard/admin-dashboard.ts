import {Component, OnInit} from '@angular/core';
import {supabase} from '@features/supabase.client';
import {CurrencyPipe, NgIf} from '@angular/common';
import {AdminChart} from '@features/pages/admin/admin-dashboard/admin-chart/admin-chart';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CurrencyPipe,
    NgIf,
    AdminChart
  ],
  templateUrl: './admin-dashboard.html',
  standalone: true,
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  loading = true;
  stats = {
    totalInvoices: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalIncome: 0,
    totalExpenses: 0
  };

  async ngOnInit(): Promise<void> {
    const [{ count: invoiceCount }, { count: userCount }, { count: categoryCount }] = await Promise.all([
      supabase.from('invoices').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true })
    ]);

    const { data: incomeData } = await supabase
      .from('invoices')
      .select('amount')
      .eq('is_incoming', true);

    const { data: expenseData } = await supabase
      .from('invoices')
      .select('amount')
      .eq('is_incoming', false);

    this.stats.totalInvoices = invoiceCount ?? 0;
    this.stats.totalUsers = userCount ?? 0;
    this.stats.totalCategories = categoryCount ?? 0;
    this.stats.totalIncome = incomeData?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
    this.stats.totalExpenses = expenseData?.reduce((sum, i) => sum + i.amount, 0) ?? 0;

    this.loading = false;
  }
}
