import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private firestore:Firestore, private toast:NgToastService) { }


  GetEspecialidades()
  {
    let col= collection(this.firestore, "especialidades");
    let q!:any;

    q = query(col);

    return collectionData(q);
  }

  AddEspecialidad(nombre:string)
  {
    const coleccionRef = collection(this.firestore, 'especialidades');
    const key = this.generarKey(nombre);

    //verifica si ya existe
    const q = query(coleccionRef, where('key', '==', key));

    getDocs(q)
      .then((snapshot) => {
        if (!snapshot.empty) 
        {
          this.toast.warning('Ya existe esta especialidad!')
          console.log('La especialidad ya existe');
          return;
        }

        // si no existe, la agrego
        return addDoc(coleccionRef, { name: nombre, key: key });
      })
      .then((docRef) => {
        if (docRef) {

          console.log('Especialidad agregada con ID:', docRef.id);
        }
      })
      .catch((error) => {
        console.log('Error al agregar o verificar especialidad:', error);
      });
  }

  private generarKey(texto: string): string 
  {
    return texto
      .normalize('NFD')               
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase()                  
      .replace(/\s+/g, '_');
  }





  
}
