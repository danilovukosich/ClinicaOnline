import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badgesEstados'
})
export class BadgesEstadosPipe implements PipeTransform {

   transform(estado: string): string {
    switch (estado) 
    {
      case 'confirmado': return 'bg-green-200 text-green-700';
      case 'pendiente': return 'bg-yellow-200 text-yellow-700';
      case 'cancelado': return 'bg-red-200 text-red-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  }

}
