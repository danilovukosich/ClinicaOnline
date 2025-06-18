import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Disponibilidad } from '../models/disponibilidad';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {

  constructor(private firestore:Firestore) { }



  
  getDisponibilidadesPorEspecialista(especialistaId: string) 
  {
    const col = collection(this.firestore, 'disponibilidades');
    const q = query(col, where('especialistaId', '==', especialistaId));

    return collectionData(q, { idField: 'id' }) as any;
  }

  async crearDisponibilidad(dispo: Disponibilidad) 
  {
    const diaNormalizado = this.removerTildes(dispo.dia);
    const id = `${dispo.especialistaId}_${diaNormalizado}`;
    const ref = doc(this.firestore, 'disponibilidades', id);

    await setDoc(ref, dispo);
  }

  async actualizarDisponibilidad(id: any, dispo: Partial<Disponibilidad>) 
  {
    const ref = doc(this.firestore, 'disponibilidades', id);
    
    await updateDoc(ref, dispo);
  }

  removerTildes(texto: string): string 
  {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }




}
