import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'invoiceType'})
export class InvoiceTypePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Received' : 'Sent';
  }
}
