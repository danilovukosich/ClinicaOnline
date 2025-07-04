import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diasDeSemana'
})
export class DiasDeSemanaPipe implements PipeTransform {

  transform(diaSemana: number): string 
  {
    switch (diaSemana) 
    {
      case 1: return 'Lunes';
      case 2: return 'Martes';
      case 3: return 'Miércoles';
      case 4: return 'Jueves';
      case 5: return 'Viernes';
      case 6: return 'Sábado';
      case 7: return 'Domingo';
      default: return '---';
    }
  }

}
