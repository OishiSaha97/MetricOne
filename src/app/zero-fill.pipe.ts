import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zerofill' })
export class ZeroFillPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const v = typeof value === 'number' ? value : 0;
    if (v < 0) return '00';
    return (v < 10 && v > -1 ? '0' : '') + v;
  }
}
