import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { switchMap } from 'rxjs';
import { HistoriaClinica } from '../models/historia-clinica';

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

    return collectionData(q, { idField: 'id' });
  }

  getTodosTurnosConHistoria()
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col);

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap(async (turnos: any[]) => {
        const historiasCol = collection(this.firestore, 'historiasClinicas');
        const historiasSnap = await getDocs(historiasCol);

        const historias = historiasSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as HistoriaClinica)
        }));

        return turnos.map(turno => {
          const historia = historias.find(h => h.turnoId === turno.id);
          return {
            ...turno,
            historiaC: historia || null
          };
        });
      })
    );
  }

  getTurnosPaciente(solicitanteId: string)
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('solicitanteId', '==', solicitanteId));

    return collectionData(q, { idField: 'id' });
  }

  getTurnosPacienteFinalizados(solicitanteId: string)
  {
    
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('solicitanteId', '==', solicitanteId),
                          where('estado', '==', 'finalizado'));

    return collectionData(q, { idField: 'id' });
  }

  getTurnosPacienteFinalizadosPorEspecialidad(solicitanteId: string, especialidadId:any)
  {
    
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('solicitanteId', '==', solicitanteId),
                          where('especialidadId.key', '==', especialidadId),
                          where('estado', '==', 'finalizado'));

    return collectionData(q, { idField: 'id' });
  }

  getTurnosPacienteConEspecialista(solicitanteId: string, especialistaId:string)
  {
    
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('solicitanteId', '==', solicitanteId), where('especialistaId', '==', especialistaId));

    return collectionData(q, { idField: 'id' });
  }


  getTurnosPacienteConHistoria(uid: string) {
    const colTurnos = collection(this.firestore, 'turnos');
    const q = query(colTurnos, where('solicitanteId', '==', uid));

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap(async (turnos: any[]) => {
        const historiasCol = collection(this.firestore, 'historiasClinicas');
        const historiasSnap = await getDocs(historiasCol);

        const historias = historiasSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as HistoriaClinica)
        }));

        return turnos.map(turno => {
          const historia = historias.find(h => h.turnoId === turno.id);
          return {
            ...turno,
            historiaC: historia || null
          };
        });
      })
    );
  }



  getTurnosEspecialista(especialistaId: string)
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('especialistaId', '==', especialistaId));

    return collectionData(q, { idField: 'id' });
  }


  getTurnosEspecialistaConHistoria(uid: string) {
    const colTurnos = collection(this.firestore, 'turnos');
    const q = query(colTurnos, where('especialistaId', '==', uid));

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap(async (turnos: any[]) => {
        const historiasCol = collection(this.firestore, 'historiasClinicas');
        const historiasSnap = await getDocs(historiasCol);

        const historias = historiasSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as HistoriaClinica)
        }));

        return turnos.map(turno => {
          const historia = historias.find(h => h.turnoId === turno.id);
          return {
            ...turno,
            historiaC: historia || null
          };
        });
      })
    );
  }

  getTurnosFinalizadosEspecialista(especialistaId: string)
  {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('especialistaId', '==', especialistaId),
                          where('estado', '==' , 'finalizado'));

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


  async calificarAtencionTurno(idTurno:string, calificacion:number)
  {
    let col = collection(this.firestore, 'calificaciones')
    await addDoc(col, {
      idTurno: idTurno,
      calificacion: calificacion
    });
  }

}
