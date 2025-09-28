import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  transform(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
