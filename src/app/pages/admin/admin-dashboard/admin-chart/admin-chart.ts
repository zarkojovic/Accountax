import {Component, OnInit} from '@angular/core';
import {supabase} from '@features/supabase.client';
import {
  ArcElement,
  BarController, BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

interface InvoiceWithCategory {
  category: {
    name: string | null;
  };
}

Chart.register(ArcElement, Tooltip, Legend, BarController, CategoryScale, LinearScale, BarElement);

@Component({
  selector: 'app-admin-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './admin-chart.html',
  standalone: true,
  styleUrl: './admin-chart.css'
})

export class AdminChart implements OnInit {
  chartData: ChartData<'pie'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'pie'> = { responsive: true, plugins: { legend: { position: 'bottom' } } };

  async ngOnInit(): Promise<void> {
    const { data, error } = await supabase
      .from('invoices')
      .select('category:categories(name)')
      .returns<InvoiceWithCategory[]>();

    const invoices = data as InvoiceWithCategory[];

    const counts = new Map<string, number>();

    for (const inv of invoices ?? []) {
      const name = inv.category?.name ?? 'Uncategorized';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }

    const labels = Array.from(counts.keys());
    const values = Array.from(counts.values());

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

    this.chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'].slice(0, labels.length)
        }
      ]
    };

  }
}
