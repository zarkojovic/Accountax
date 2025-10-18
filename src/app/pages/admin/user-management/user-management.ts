import { Component, OnInit } from '@angular/core';
import { supabase } from '@features/supabase.client';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'user-management',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  async ngOnInit(): Promise<void> {
    await this.fetchUsers();
    this.applyFilters();
    this.loading = false;
  }

  async fetchUsers(): Promise<void> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        email,
        company_id,
        company_name,
        avatar,
        role_id,
        roles (
          name
        )
      `)
      .order('created_at', { ascending: false });



    if (data) {
      this.users = data.map(u => ({
        ...u,
      }));
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
    }
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.first_name?.toLowerCase().includes(query) ||
      u.last_name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );

    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 1;
  }

  editUser(user: any): void {
    // You can open a modal or populate a form here
    console.log('Edit user:', user);
  }

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  async deleteUser(id: string): Promise<void> {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) {
      await this.fetchUsers();
      this.applyFilters();
    }
  }

  async toggleRole(user: any): Promise<void> {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', user.id);

    if (!error) {
      user.role = newRole;
    }
  }
}
