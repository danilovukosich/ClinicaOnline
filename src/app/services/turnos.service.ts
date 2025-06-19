import { addDoc, collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore) { }


  getTurnosSeleccionados(especialistaId: string, especialidadId:string) 
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('especialistaId', '==', especialistaId), 
                         where('especialidadId', '==', especialidadId),
                         where('estado', 'in', ['pendiente', 'aceptado', 'finalizado']));

    return collectionData(q);
  }

  getTodosTurnos()
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col);

    return collectionData(q);
  }

  getTurnosPaciente(solicitanteId: string)
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('solicitanteId', '==', solicitanteId));

    return collectionData(q);
  }

  async generarTurno(turno:Turno)
  {
    let col = collection(this.firestore, 'turnos')
    await addDoc(col, turno);
  }

  async cambiarEstadoDeTurno(estado:any)
  {

  }

}
