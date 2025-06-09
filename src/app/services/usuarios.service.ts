import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore:Firestore) { }

  GetUsuarios(rol:string)
  {

    let col = collection(this.firestore, "userInfo")
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


  
}
