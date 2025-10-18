import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../core/services/session.servies';
import {of} from 'rxjs';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home {
  constructor(public session: SessionService, private router: Router) {}

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
  carouselItems = [
    {
      image: 'https://images.pexels.com/photos/4476375/pexels-photo-4476375.jpeg',
      title: 'Smart Invoicing',
      description: 'Create, track, and manage invoices with ease. Categorize income and expenses in seconds.',
      button: {
        text: 'Explore Invoicing',
        link: '/invoices'
      }
    },
    {
      image: 'https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg',
      title: 'Visual Dashboards',
      description: 'Get instant clarity with dynamic charts and real-time financial insights.',
      button: {
        text: 'View Dashboard',
        link: '/admin'
      }
    },
    {
      image: 'https://images.pexels.com/photos/6694570/pexels-photo-6694570.jpeg',
      title: 'Modular Architecture',
      description: 'Built with Angular standalone components for speed, scalability, and maintainability.',
      button: {
        text: 'Learn More',
        link: '/about'
      }
    },
    {
      image: 'https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg',
      title: 'Secure Admin Panel',
      description: 'Manage users, roles, and data with confidence using Supabase and role-based access.',
      button: {
        text: 'Go to Admin',
        link: '/admin/users'
      }
    },
    {
      image: 'https://images.pexels.com/photos/7821698/pexels-photo-7821698.jpeg',
      title: 'Effortless Accounting',
      description: 'Say goodbye to spreadsheets. Accountex automates the boring parts of bookkeeping.',
      button: {
        text: 'Get Started',
        link: '/register'
      }
    }
  ];

    ngOnInit() {
    this.session.user$.subscribe(user => {
      if (user) {
        console.log('Logged in as:', user.email);
        console.log('Role ID:', user.role_id);
      } else {
        console.log('Not authenticated');
      }
    });
  }

  protected readonly of = of;
}
