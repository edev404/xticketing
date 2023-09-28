import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitaleze'
})
export class CapitalezePipe implements PipeTransform {
  transform(value: string): string {
    let valor = value.toLowerCase();
    return valor.charAt(0).toUpperCase() + value.substring(1, value.length).toLowerCase();
  }
}
