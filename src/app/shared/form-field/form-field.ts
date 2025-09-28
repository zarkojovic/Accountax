import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'form-field',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-field.html',
  standalone: true,
  styleUrl: './form-field.css'
})
export class FormField {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
}
