import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';
import {supabase} from '@features/supabase.client';
import {InvoiceService} from '@core/services/invoice.service';
import {FormsModule} from '@angular/forms';

// Register required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.css'],
  standalone: true,
  imports: [BaseChartDirective, FormsModule],
})
export class BarChartComponent implements OnInit {
  invoices: any[] = [];
  sortByProfit = false;
  monthsBack?: number;
  chartLabels: string[] = [];
  incomingData: number[] = [];
  outgoingData: number[] = [];

  async fetchInvoices(): Promise<void> {
    const { data: invoiceData, error } = await supabase
      .from('invoices')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (!invoiceData) return;

    const now = new Date();
    const cutoff = this.monthsBack ? new Date(now.getFullYear(), now.getMonth() - this.monthsBack, 1) : null;

    const monthlyTotals = new Map<string, { incoming: number; outgoing: number }>();

    for (const invoice of invoiceData) {
      const created = new Date(invoice.created_at);
      if (cutoff && created < cutoff) continue;

      const month = created.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyTotals.has(month)) {
        monthlyTotals.set(month, { incoming: 0, outgoing: 0 });
      }

      const entry = monthlyTotals.get(month)!;
      if (invoice.is_incoming) {
        entry.incoming += invoice.amount;
      } else {
        entry.outgoing += invoice.amount;
      }
    }

    let sortedMonths = Array.from(monthlyTotals.keys());

    if (this.sortByProfit) {
      sortedMonths.sort((a, b) => {
        const profitA = monthlyTotals.get(a)!.incoming - monthlyTotals.get(a)!.outgoing;
        const profitB = monthlyTotals.get(b)!.incoming - monthlyTotals.get(b)!.outgoing;
        return profitB - profitA;
      });
    } else {
      sortedMonths.sort((a, b) => {
        const aDate = new Date(`1 ${a}`);
        const bDate = new Date(`1 ${b}`);
        return aDate.getTime() - bDate.getTime();
      });
    }

    this.chartLabels = sortedMonths;
    this.incomingData = sortedMonths.map(month => monthlyTotals.get(month)!.incoming);
    this.outgoingData = sortedMonths.map(month => monthlyTotals.get(month)!.outgoing);

    this.updateChart();
  }


  filterByMonths(months?: number): void {
    this.monthsBack = months;
    this.fetchInvoices();
  }

  constructor(private invoiceService: InvoiceService) {
    this.invoiceService.refresh$.subscribe(() => {
      this.fetchInvoices();
      this.updateChart();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.fetchInvoices();
  }

  data: ChartData<'bar'> = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Incoming (€)',
        data: this.incomingData,
        backgroundColor: '#22c55e'
      },
      {
        label: 'Outgoing (€)',
        data: this.outgoingData,
        backgroundColor: '#ef4444'
      }
    ]
  };
  updateChart(): void {
    this.data = {
      labels: this.chartLabels,
      datasets: [
        {
          label: 'Incoming (€)',
          data: this.incomingData,
          backgroundColor: '#22c55e'
        },
        {
          label: 'Outgoing (€)',
          data: this.outgoingData,
          backgroundColor: '#ef4444'
        }
      ]
    };
  }

  options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }


}
