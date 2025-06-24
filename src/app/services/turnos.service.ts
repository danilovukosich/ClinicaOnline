import { addDoc, collection, collectionData, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
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

    return collectionData(q, { idField: 'id' });
  }

  getTurnosEspecialista(especialistaId: string)
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('especialistaId', '==', especialistaId));

    return collectionData(q, { idField: 'id' });
  }

  async generarTurno(turno:Turno)
  {
    let col = collection(this.firestore, 'turnos')
    await addDoc(col, turno);
  }

  async cambiarEstadoDeTurno(turnoId:string,estado:string)
  {
    let docRef = doc(this.firestore, "turnos", turnoId);
    
    updateDoc(docRef, {
      estado: estado
    })
    .then(() => {
      console.log("Estado turno cambiado a: "+ estado);
    })
    .catch(error => {
      console.error("Error al cambiar el estado del tunro:", error);
    });
  }

  async dejarComentarioEnTurno(turnoId:string,comentario:string)
  {
    let docRef = doc(this.firestore, "turnos", turnoId);
    
    updateDoc(docRef, {
      comentario: comentario
    })
    .then(() => {
      console.log("comentario turno cambiado a: "+ comentario);
    })
    .catch(error => {
      console.error("Error al cambiar el comentario del tunro:", error);
    });
  }

}
