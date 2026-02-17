import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateWords',
  standalone: true // si estás usando Angular 15+ o standalone components
})
export class SeparateWordsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Inserta un espacio antes de cada mayúscula, excepto al inicio
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  }
}
