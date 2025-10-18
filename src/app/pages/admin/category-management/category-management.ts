import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {supabase} from '@features/supabase.client';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-category-management',
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './category-management.html',
  standalone: true,
  styleUrl: './category-management.css'
})
export class CategoryManagement implements OnInit {
  categories: any[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  async ngOnInit(): Promise<void> {
    await this.fetchCategories();
    this.loading = false;
  }

  async fetchCategories(): Promise<void> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('created_at', { ascending: false });

    if (data) {
      this.categories = data;
      this.totalPages = Math.ceil(this.categories.length / this.pageSize);
    }
  }

  get paginated(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.categories.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  editCategory(cat: any): void {
    console.log('Edit category', cat);
    // this.router.navigate(['/admin/categories', cat.id, 'edit']);
  }

  async deleteCategory(id: string): Promise<void> {
    const confirmed = confirm('Delete this category?');
    if (!confirmed) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) await this.fetchCategories();
  }
}
