import { Component } from '@angular/core';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, ChartOptions, LineController, Point, PointElement, LineElement
} from 'chart.js';
import {supabase} from '@features/supabase.client';
import {BaseChartDirective} from 'ng2-charts';

// Register required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineController, PointElement, LineElement);


@Component({
  selector: 'app-profit-chart',
  imports: [
    BaseChartDirective
  ],
  standalone: true,
  templateUrl: './profit-chart.html',
  styleUrl: './profit-chart.css'
})
export class ProfitChart {
  chartLabels: string[] = [];
  profitData: number[] = [];

  data: {
    datasets: {
      borderColor: string;
      backgroundColor: string;
      tension: number;
      data: number[];
      label: string;
      fill: boolean;
      pointRadius: number
    }[];
    labels: string[]
  } = { labels: [], datasets: [] };
  options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Profit (€)' }
      },
      x: {
        title: { display: true, text: 'Month' }
      }
    }
  };

  async ngOnInit(): Promise<void> {
    await this.loadProfitData(); // default to all time
  }

  async loadProfitData(monthsBack?: number): Promise<void> {
    const { data: invoiceData, error } = await supabase
      .from('invoices')
      .select('created_at, amount, is_incoming')
      .order('created_at', { ascending: true });

    if (!invoiceData) return;

    const now = new Date();
    const cutoff = monthsBack ? new Date(now.getFullYear(), now.getMonth() - monthsBack, 1) : null;

    const monthlyProfit = new Map<string, number>();

    for (const invoice of invoiceData) {
      const created = new Date(invoice.created_at);
      if (cutoff && created < cutoff) continue;

      const month = created.toLocaleString('default', { month: 'short', year: 'numeric' });
      const amount = invoice.is_incoming ? invoice.amount : -invoice.amount;

      monthlyProfit.set(month, (monthlyProfit.get(month) ?? 0) + amount);
    }

    const sortedMonths = Array.from(monthlyProfit.keys()).sort((a, b) => {
      const aDate = new Date(`1 ${a}`);
      const bDate = new Date(`1 ${b}`);
      return aDate.getTime() - bDate.getTime();
    });

    this.chartLabels = sortedMonths;
    this.profitData = sortedMonths.map(month => monthlyProfit.get(month)!);

    this.data = {
      labels: this.chartLabels,
      datasets: [
        {
          label: 'Monthly Profit (€)',
          data: this.profitData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }
      ]
    };
  }
}
