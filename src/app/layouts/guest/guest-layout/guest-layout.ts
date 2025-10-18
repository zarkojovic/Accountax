import { Component } from '@angular/core';
import {Navbar} from '../shared/navbar/navbar';
import {Footer} from '../shared/footer/footer';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-guest-layout',
  imports: [
    Navbar,
    Footer,
    RouterModule
  ],
  templateUrl: './guest-layout.html',
  standalone: true,
  styleUrl: './guest-layout.css'
})
export class GuestLayout {

}
