import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { HistoriaClinica } from '../models/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  constructor(private firestore:Firestore) { }

  getHistoriaClinicaPaciente(pacienteId:string)
  {
    const col = collection(this.firestore, 'historiasClinicas');
    const q = query(col, where('pacienteId', '==', pacienteId));
    
    return collectionData(q, { idField: 'id' }) as any;

  }

  async cargarHistoriaClinica(historiaClinica: HistoriaClinica) 
  {

    try 
    {
      let col = collection(this.firestore, 'historiasClinicas')
      await addDoc(col, historiaClinica);
  
  
      let docRef = doc(this.firestore, "turnos", historiaClinica.turnoId);
          
      updateDoc(docRef, {
        historiaClinica: true
      })
      .then(() => {
        console.log("Se cargo la historia");
      })
      .catch(error => {
        console.error("Error al cambiar el estado del tunro en la historia:", error);
      });

      return true;

    } 
    catch (error) 
    {
      console.error('Error al guardar la historia clínica:', error);
      return false;
    }

  }


}
