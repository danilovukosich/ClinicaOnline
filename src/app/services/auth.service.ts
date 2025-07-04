import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile, User } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UsuarioPaciente } from '../models/usuario-paciente';
import { UsuarioEspecialista } from '../models/usuario-especialista';
import { from, Observable } from 'rxjs';
import { deleteApp, initializeApp } from 'firebase/app';
import { UsuarioAdmnistrador } from '../models/usuario-admnistrador';
import { onAuthStateChanged } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth, private firestore:Firestore, private router:Router, private toast:NgToastService, private storageService:StorageService) { }


  ngOnInit(): void 
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(()=>{

    },1000);
  }

  async RegisterPaciente(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioPaciente, archivo:File, archivo2:File):Promise <any>
  {

    try
    {
      let urlFoto:string = '';
      let urlFoto2:string = '';
      
      const userCredencial = await createUserWithEmailAndPassword(this.auth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;
      //let col = collection(this.firestore, 'userInfo');

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName

      console.log('llego 1');
      
      if (archivo) 
      {
        urlFoto = await this.storageService.subirImagen(user.uid, archivo, 'fotosPerfil');
        urlFoto2 = await this.storageService.subirImagen(user.uid, archivo2, 'fotosPortada');

        console.log('URL FOTO:');
        console.log(urlFoto);
        
        await updateProfile(user, {photoURL:urlFoto});
      }
      console.log('salio de if');
      

      const userDocRef= doc(this.firestore, "userInfo", user.uid);
      //console.log(user.displayName);

      await setDoc(userDocRef,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "obraSocial": usuario.obraSocial,
          "rol":'paciente',
          "imagen":urlFoto,
          "imagen2":urlFoto2
        });

      console.log("Usuario registrado");

      await sendEmailVerification(user);//envio un mail de verificacion
      
      await signOut(this.auth);

    }
    catch(e:any)
    {
      console.log(e.code);

      switch (e.code) 
      {
        case "auth/invalid-email":
          this.toast.danger("Email Invalido", "Error");
        break;
        case "auth/email-already-in-use":
          this.toast.danger("Email en uso", "Error");
        break;
        case "auth/weak-password":
          this.toast.danger("Contraseña menor a 6 digitos", "Error");
        break;
        case "auth/invalid-credential":
          this.toast.danger("Credenciales invalidas", "Error");
        break;
        default:
          this.toast.danger("Credenciales invalidas", "Error");
        break;
      }

      throw e;

    }
    
  }

  async RegisterPacienteAdministrador(nuevoUsuarioMail: string,nuevoUsuarioContra: string, usuario: UsuarioPaciente, archivo: File, archivo2: File): Promise<any> 
  {
    let secondaryAuth: Auth | null = null;

    try {
      let urlFoto: string = '';
      let urlFoto2: string = '';

      // 1. Inicializar app secundaria
      const secondaryApp = initializeApp({
        apiKey: "AIzaSyDWkq7gVfOEcz-gXSiDI72HUMg7KhrDwp4",
        authDomain: "clinicaonline-27fd8.firebaseapp.com",
        projectId: "clinicaonline-27fd8",
        storageBucket: "clinicaonline-27fd8.firebasestorage.app",
        appId: "1:919321728060:web:fb7c80ed319f4dc8775f39",
        messagingSenderId: "919321728060"
      }, 'SecondaryApp');

      secondaryAuth = getAuth(secondaryApp);

      // 2. Crear usuario con secondary auth
      const userCredencial = await createUserWithEmailAndPassword(secondaryAuth, nuevoUsuarioMail, nuevoUsuarioContra);
      const user = userCredencial.user;

      await updateProfile(user, { displayName: usuario.rol });

      // 3. Subir imágenes (si hay)
      if (archivo) {
        urlFoto = await this.storageService.subirImagen(user.uid, archivo, 'fotosPerfil');
        urlFoto2 = await this.storageService.subirImagen(user.uid, archivo2, 'fotosPortada');

        await updateProfile(user, { photoURL: urlFoto });
      }

      // 4. Guardar en Firestore
      const userDocRef = doc(this.firestore, "userInfo", user.uid);

      await setDoc(userDocRef, {
        "id": user.uid,
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "edad": usuario.edad,
        "dni": usuario.dni,
        "obraSocial": usuario.obraSocial,
        "rol": 'paciente',
        "imagen": urlFoto,
        "imagen2": urlFoto2
      });

      // 5. Verificar email
      await sendEmailVerification(user);

      // 6. Cerrar sesión de la instancia secundaria
      await signOut(secondaryAuth);
      
      await deleteApp(secondaryApp);

      console.log("Usuario registrado con secondary auth");
    } catch (e: any) {
      console.error(e.code);

      switch (e.code) {
        case "auth/invalid-email":
          this.toast.danger("Email Invalido", "Error");
          break;
        case "auth/email-already-in-use":
          this.toast.danger("Email en uso", "Error");
          break;
        case "auth/weak-password":
          this.toast.danger("Contraseña menor a 6 dígitos", "Error");
          break;
        case "auth/invalid-credential":
          this.toast.danger("Credenciales inválidas", "Error");
          break;
        default:
          this.toast.danger("Error desconocido al registrar usuario", "Error");
          break;
      }

      if (secondaryAuth) await signOut(secondaryAuth); // por si quedó sesión abierta
      throw e;
    }
  }






  async RegisterEspecialista(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioEspecialista, archivo:File):Promise<any>
  {
    try
    {
      let urlFoto!:string;
      const userCredencial = await createUserWithEmailAndPassword(this.auth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;
      //let col = collection(this.firestore, 'userInfo');
      await signOut(this.auth);

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName
      if (archivo) 
      {
        urlFoto = await this.storageService.subirImagen(user.uid, archivo, 'fotosPerfil');
        console.log('URL FOTO:');
        console.log(urlFoto);
        
        await updateProfile(user, {photoURL:urlFoto});
      }
      console.log(user.displayName);

      const userDocRef= doc(this.firestore, "userInfo", user.uid);//creo el doc con el id igual al user uid


      await setDoc(userDocRef,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "especialidades": usuario.especialidades,
          "estado":usuario.estado,
          "rol":'especialista',
          "imagen":urlFoto
        });

      console.log("Usuario registrado");

      await sendEmailVerification(user);//envio un mail de verificacion
      

    }
    catch(e:any)
    {
      console.log(e.code);

      switch (e.code) 
      {
        case "auth/invalid-email":
          this.toast.danger("Email Invalido", "Error");
        break;
        case "auth/email-already-in-use":
          this.toast.danger("Email en uso", "Error");
        break;
        case "auth/weak-password":
          this.toast.danger("Contraseña menor a 6 digitos", "Error");
        break;
        case "auth/invalid-credential":
          this.toast.danger("Credenciales invalidas", "Error");
        break;
        default:
          this.toast.danger("Credenciales invalidas", "Error");
        break;
      }

      throw e;

    }
  }



  async RegisterEspecialistaAdministrador(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioEspecialista, archivo:File):Promise<any>
  {
    let secondaryAuth: Auth | null = null;
    try
    {
      let urlFoto!:string;

       const secondaryApp = initializeApp({
        apiKey: "AIzaSyDWkq7gVfOEcz-gXSiDI72HUMg7KhrDwp4",
        authDomain: "clinicaonline-27fd8.firebaseapp.com",
        projectId: "clinicaonline-27fd8",
        storageBucket: "clinicaonline-27fd8.firebasestorage.app",
        appId: "1:919321728060:web:fb7c80ed319f4dc8775f39",
        messagingSenderId: "919321728060"
      }, 'SecondaryApp');

      secondaryAuth = getAuth(secondaryApp);




      const userCredencial = await createUserWithEmailAndPassword(secondaryAuth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;
      //let col = collection(this.firestore, 'userInfo');

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName
      if (archivo) 
      {
        urlFoto = await this.storageService.subirImagen(user.uid, archivo, 'fotosPerfil');
        console.log('URL FOTO:');
        console.log(urlFoto);
        
        await updateProfile(user, {photoURL:urlFoto});
      }

      const userDocRef= doc(this.firestore, "userInfo", user.uid);//creo el doc con el id igual al user uid


      await setDoc(userDocRef,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "especialidades": usuario.especialidades,
          "estado":usuario.estado,
          "rol":'especialista',
          "imagen":urlFoto
        });

      console.log("Usuario registrado");

      await sendEmailVerification(user);//envio un mail de verificacion

      await signOut(secondaryAuth);
      
      await deleteApp(secondaryApp);

    }
    catch(e:any)
    {
      console.log(e.code);

      switch (e.code) 
      {
        case "auth/invalid-email":
          this.toast.danger("Email Invalido", "Error");
        break;
        case "auth/email-already-in-use":
          this.toast.danger("Email en uso", "Error");
        break;
        case "auth/weak-password":
          this.toast.danger("Contraseña menor a 6 digitos", "Error");
        break;
        case "auth/invalid-credential":
          this.toast.danger("Credenciales invalidas", "Error");
        break;
        default:
          this.toast.danger("Credenciales invalidas", "Error");
        break;
      }

      throw e;

    }
  }


  async RegisterAdministrador(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioAdmnistrador, archivo:File):Promise<any>
  {
    let secondaryAuth: Auth | null = null;
    try
    {
      let urlFoto!:string;

       const secondaryApp = initializeApp({
        apiKey: "AIzaSyDWkq7gVfOEcz-gXSiDI72HUMg7KhrDwp4",
        authDomain: "clinicaonline-27fd8.firebaseapp.com",
        projectId: "clinicaonline-27fd8",
        storageBucket: "clinicaonline-27fd8.firebasestorage.app",
        appId: "1:919321728060:web:fb7c80ed319f4dc8775f39",
        messagingSenderId: "919321728060"
      }, 'SecondaryApp');

      secondaryAuth = getAuth(secondaryApp);

      const userCredencial = await createUserWithEmailAndPassword(secondaryAuth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName
      
      if (archivo) 
      {
        urlFoto = await this.storageService.subirImagen(user.uid, archivo, 'fotosPerfil');
        console.log('URL FOTO:');
        console.log(urlFoto);
        
        await updateProfile(user, {photoURL:urlFoto});
      }

      const userDocRef= doc(this.firestore, "userInfo", user.uid);//creo el doc con el id igual al user uid


      await setDoc(userDocRef,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "rol":'admin',
          "imagen":urlFoto
        });

      console.log("Usuario registrado");

      await sendEmailVerification(user);//envio un mail de verificacion

      await signOut(secondaryAuth);
      
      await deleteApp(secondaryApp);

    }
    catch(e:any)
    {
      console.log(e.code);

      switch (e.code) 
      {
        case "auth/invalid-email":
          this.toast.danger("Email Invalido", "Error");
        break;
        case "auth/email-already-in-use":
          this.toast.danger("Email en uso", "Error");
        break;
        case "auth/weak-password":
          this.toast.danger("Contraseña menor a 6 digitos", "Error");
        break;
        case "auth/invalid-credential":
          this.toast.danger("Credenciales invalidas", "Error");
        break;
        default:
          this.toast.danger("Credenciales invalidas", "Error");
        break;
      }

      throw e;

    }
  }

  Log()
  {
    let col = collection(this.firestore, 'logs');
    
    addDoc(col,{fecha:new Date(), "userMail":this.auth.currentUser?.email});
  }

  



  //LOGIN
  async LogUser(email:string,password:string)// funcion de login
  {
    
    try
    {
      const userCredential= await signInWithEmailAndPassword(this.auth, email,password)
      const user = userCredential.user;


      if(user.emailVerified)
      {
        if(user.displayName=='paciente')
        {
          this.toast.success("Logueo exitoso", "Exito");
          this.Log();//logs en firestore
          this.router.navigate(["home/welcomeText"]);

        }
        else
        {
          if(user.displayName=='especialista' || user.displayName=='admin')
          {
            const docRef=doc(this.firestore, `userInfo/${user.uid}`);
            const userInfo = await getDoc(docRef);

            if(userInfo.exists())
            {
              let data = userInfo.data()
              console.log(userInfo);

              console.log(data['estado']);

              if(data['estado']==1)
              {
                this.toast.success("Logueo exitoso", "Exito");
                this.Log();//logs en firestore
                this.router.navigate(["home/welcomeText"]);
              }
              else
              {
                this.toast.danger("Espere a que su cuenta sea aprobadoa por un administrador.", "Cuenta no validada", 3000);
                await this.auth.signOut();
              }
            }

          }
        }
  
      }
      else
      {
        this.toast.danger("Verifique su cuenta con el link enviado a su casilla de correo.", "Cuenta no verificada", 3000);
        await this.auth.signOut();
      }
       
    }
    catch(e:any)
    {
      switch(e.code)
      {
        case "auth/invalid-credential":
        this.toast.danger("Credenciales invalidas", "Error");
        break;
        
        case "auth/invalid-email":
          this.toast.danger("Email invalido", "Error");
        break;

        default:
          this.toast.danger("Credenciales invalidas", "Error");
        break;
      }

      throw e;

    }
    
    
    
  } 

  LogOut()//Funcion de loogut
  {
    signOut(this.auth).then(()=>{
      console.log("Se deslogueo exitosamente!");
      this.toast.info("Se deslogueo", "Atencion");
      this.router.navigate(["login"]);
    });
  }

  GetUser()//trae el usuario si esta logueado, sino devuelve null
  {
    return this.auth.currentUser;
  }

  GetUserAsync(): Promise<User | null> 
  {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  GetUserInfo(): Observable<any> 
  {
    return new Observable((observer) => {
    this.auth.onAuthStateChanged(async (user) => {
      if (!user) 
      {
        observer.error('Usuario no autenticado');
        return;
      }

      try 
      {
        const docRef = doc(this.firestore, `userInfo/${user.uid}`);
        const userInfoSnap = await getDoc(docRef);
        observer.next(userInfoSnap.data());
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
      });
    });
  }

  getUserInfoById(uid: string): Observable<any> {
    return new Observable((observer) => {
      const docRef = doc(this.firestore, `userInfo/${uid}`);
      console.log(docRef);
      
      getDoc(docRef)
        .then((snap) => {
          if (snap.exists()) {
            observer.next(snap.data());
          } else {
            observer.error('No existe el usuario');
          }
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  GetRole()
  {
    return this.auth.currentUser?.displayName;
  }

  async GetRoleHome(): Promise<string | null> 
  {
    return new Promise((resolve) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        resolve(user?.displayName ?? null);
      });
    });
  }

  async GetUserId(): Promise<string | null> 
  {
    return new Promise((resolve) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        resolve(user?.uid ?? null);
      });
    });
  }

}
