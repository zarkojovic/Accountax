import { Component } from '@angular/core';
import {supabase} from '@features/supabase.client';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './contact.html',
  standalone: true,
  styleUrl: './contact.css'
})
export class Contact {
  name = '';
  email = '';
  message = '';
  success = false;
  error = '';

  async submit(): Promise<void> {
    this.success = false;
    this.error = '';

    if (!this.name || !this.email || !this.message) {
      this.error = 'All fields are required.';
      return;
    }

    const { error } = await supabase.from('contact_messages').insert({
      name: this.name,
      email: this.email,
      message: this.message
    });

    if (error) {
      this.error = 'Something went wrong. Please try again.';
    } else {
      this.success = true;
      this.name = '';
      this.email = '';
      this.message = '';
    }
  }
}
