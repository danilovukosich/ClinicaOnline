import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreEspecialistaCompleto'
})
export class NombreEspecialistaCompletoPipe implements PipeTransform {

  transform(nombreEspecialista: string): string 
  {
    return 'Esp. ' + nombreEspecialista;
  }

}
