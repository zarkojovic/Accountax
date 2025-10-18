import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  standalone: true,
  styleUrl: './about.css'
})
export class About {

  public year = new Date().getFullYear(); // ✅ Works if someString is a valid date string

}
