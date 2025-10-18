import {Component, inject} from '@angular/core';
import {NAV_ITEMS, NavItem} from './navbar.config';
import {RouterLink} from '@angular/router';
import {SessionService, SessionUser} from '../../../../core/services/session.servies';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  standalone: true,
  styleUrl: './navbar.css'
})
export class Navbar {

  navItems: NavItem[] = NAV_ITEMS;
  currentUser: SessionUser | null = null;
  constructor(public session: SessionService) {}

  ngOnInit(): void {
    this.currentUser = this.session.currentUser;
    console.log('Current User in Navbar:', this.currentUser);
  }

  get visibleItems(): NavItem[] {
    const userRole = this.session.currentUser?.role_id ?? 0; // Default to Guest role if not logged in
    return this.navItems.filter(item => !item.roles || item.roles.includes(userRole as any));
  }
}
