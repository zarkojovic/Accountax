import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'currencyType'})
export class CurrencyTypePipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}
