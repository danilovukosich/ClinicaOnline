import { Inject, Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
//import { FirebaseStorage } from '@angular/fire/storage';

import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {}

  async subirImagen(uid: string, archivo: File, carpeta:string): Promise<string> 
  {
    const ruta = `${carpeta}/${uid}`;
    const referencia = ref(this.storage, ruta);

    await uploadBytes(referencia, archivo);
    
    return await getDownloadURL(referencia);
  }
}
