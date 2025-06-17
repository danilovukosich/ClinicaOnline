import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore:Firestore) { }

  GetUsuarios(rol:string)
  {

    let col = collection(this.firestore, "userInfo");
    let q!:any;

    switch(rol)
    {
      case 'especialista':
        q = query(col, where('rol', '==', 'especialista'));
        break;
      case 'paciente':
        q = query(col, where('rol', '==', 'paciente'));
        break;
      case 'admin':
        q = query(col, where('rol', '==', 'admin'));
        break;
    }

    return collectionData(q);
  }

  GetEspecialistas(especialidad:any)
  {
    
    
    let col = collection(this.firestore, "userInfo");
    let q!:any;

    q = query(col, where('rol', '==', 'especialista'),
                  where('especialidades', 'array-contains', especialidad.key));
    
    return collectionData(q);
    
  }

  SetEstadoCero(userId:any)
  {
    let docRef = doc(this.firestore, "userInfo", userId);

    updateDoc(docRef, {
      estado: 0
    })
    .then(() => {
      console.log("Usuario dado de baja correctamente.");
    })
    .catch(error => {
      console.error("Error al dar de baja el usuario:", error);
    });

  }

  SetEstadoUno(userId:any)
  {
    let docRef = doc(this.firestore, "userInfo", userId);

    updateDoc(docRef, {
      estado: 1
    })
    .then(() => {
      console.log("Usuario dado de baja correctamente.");
    })
    .catch(error => {
      console.error("Error al dar de baja el usuario:", error);
    });
  }


  
}
