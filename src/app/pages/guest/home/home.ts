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
    this.router.navigate([path]);
  }
  carouselItems = [
    {
      image:'https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp',
      title: 'First Slide',
      description: 'This is the first slide description.',
      button:{
        text:'Learn More',
        link:'#'
      }
    },
    {
      image:'https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp',
      title: 'Second Slide',
      description: 'This is the first slide description.',
      button:{
        text:'Learn More',
        link:'#'
      }
    },
    {
      image:'https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp',
      title: 'Third Slide',
      description: 'This is the first slide description.',
      button:{
        text:'Learn More',
        link:'#'
      }
    },
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
