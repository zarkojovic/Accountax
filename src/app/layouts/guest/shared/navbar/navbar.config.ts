import {Role} from '@core/interfaces/role.interfaces';

export interface NavItem {
  label: string;
  path: string;
  roles?: Role[]; // optional: [Role.Admin, Role.User]
  isAuth?: boolean; // optional: true if the item is for authenticated users only
}

export const NAV_ITEMS: NavItem[] = [
  {label: 'Home', path: '/', roles: [Role.Guest, Role.User, Role.Admin]},
  {label: 'Dashboard', path: '/user/dashboard', roles: [Role.User]},
  {label: 'About', path: '/about', roles: [Role.Guest, Role.User, Role.Admin]},
  {label: 'Contact', path: '/contact', roles: [Role.Guest, Role.User, Role.Admin]},
  {label: 'Author', path: '/author', roles: [Role.Guest, Role.User, Role.Admin]},
  {label: 'Admin Panel', path: '/admin/dashboard', roles: [Role.Admin]},
  {label: 'Sign In', path: '/auth/login', roles: [Role.Guest], isAuth: true},
  {label: 'Register', path: '/auth/register', roles: [Role.Guest], isAuth: true},
];
