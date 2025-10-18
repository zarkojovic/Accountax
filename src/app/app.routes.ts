import {Routes} from '@angular/router';
import {AuthLayout} from './layouts/auth/auth-layout/auth-layout';
import {UserLayout} from './layouts/user/user-layout/user-layout';
import {AdminLayout} from './layouts/admin/admin-layout/admin-layout';
import {GuestLayout} from './layouts/guest/guest-layout/guest-layout';
import {RoleGuard} from '@core/guards/role.guard';
import {Role} from '@core/interfaces/role.interfaces';

export const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: GuestLayout,
    children: [
      {path: '', loadComponent: () => import('./pages/guest/home/home').then(m => m.Home)},
      {path: 'about', loadComponent: () => import('./pages/guest/about/about').then(m => m.About)},
      {path: 'contact', loadComponent: () => import('./pages/guest/contact/contact').then(m => m.Contact)},
      {path: 'author', loadComponent: () => import('./pages/guest/author/author').then(m => m.Author)}
    ]
  },
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [RoleGuard],
    data: { roles: [Role.Guest] },
    children: [
      {path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)},
      {path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.Register)}
    ]
  },
  {
    path: 'user',
    component: UserLayout,
    canActivate: [RoleGuard],
    data: { roles: [Role.User] },
    children: [
      // {path: '', loadComponent: () => import('./pages/user/dashboard/dashboard').then(m => m.Dashboard)},
      {path: 'profile', loadComponent: () => import('./pages/user/profile/profile').then(m => m.Profile)},
      {path: 'dashboard', loadComponent: () => import('./pages/user/dashboard/dashboard').then(m => m.Dashboard)},
      {path: 'invoices', loadComponent: () => import('./pages/user/invoices/invoices').then(m => m.Invoices)},
      {path: 'invoice/:id', loadComponent: () => import('./pages/user/invoice-detail/invoice-detail').then(m => m.InvoiceDetail)},
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [RoleGuard],
    data: { roles: [Role.Admin] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/user-management/user-management').then(m => m.UserManagement)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/admin/invoice-management/invoice-management').then(m => m.InvoiceManagement)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/category-management/category-management').then(m => m.CategoryManagement)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./pages/admin/user-management/edit-user/edit-user').then(m => m.EditUser)
      },
      {
        path: 'invoices/:id/edit',
        loadComponent: () => import('./pages/admin/invoice-management/edit-invoice/edit-invoice').then(m => m.EditInvoice)
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () => import('./pages/admin/category-management/edit-category/edit-category').then(m => m.EditCategory)
      }
    ]
  },
  {path: '**', redirectTo: ''}
];
