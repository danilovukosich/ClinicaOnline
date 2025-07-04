import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { take } from 'rxjs';

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

    return collectionData(q, { idField: 'id' });
  }

  // getAllUsers()
  // {
  //   let col = collection(this.firestore, "userInfo");
  //   const q = query(col);

  //   return collectionData(q).pipe(take(1));
  // }

  getAllUsers()
  {
    const colRef = collection(this.firestore, 'userInfo');
    return getDocs(colRef).then(snapshot => {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }); 
  }


  getLogs()
  {
    const colRef = collection(this.firestore, 'logs');
    return getDocs(colRef).then(snapshot => {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }); 
  }

  GetEspecialistas(especialidad:any)
  {
    
    
    let col = collection(this.firestore, "userInfo");
    let q!:any;

    q = query(col, where('rol', '==', 'especialista'),
                  where('especialidades', 'array-contains', especialidad.key));
    
    return collectionData(q);
    
  }

  GetPacientesDeEspecialista(idsTurnos:string[])
  {
    console.log('tunros:', idsTurnos);
    let col = collection(this.firestore, "userInfo");
    let q!:any;

    q = query(col, where('rol', '==', 'paciente'),
                  where('id', 'in', idsTurnos));
    
    return collectionData(q, { idField: 'id' });
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
