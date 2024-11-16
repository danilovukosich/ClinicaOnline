import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UsuarioPaciente } from '../models/usuario-paciente';
import { UsuarioEspecialista } from '../models/usuario-especialista';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth:Auth, private firestore:Firestore, private router:Router, private toast:NgToastService) { }


  ngOnInit(): void 
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    setTimeout(()=>{

    },1000);
  }

  async RegisterPaciente(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioPaciente):Promise <any>
  {

    try
    {

      const userCredencial = await createUserWithEmailAndPassword(this.auth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;
      let col = collection(this.firestore, 'userInfo');

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName
      
      console.log(user.displayName);

      await addDoc(col,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "obraSocial": usuario.obraSocial
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

  async RegisterEspecialista(nuevoUsuarioMail:string,nuevoUsuarioContra:string, usuario:UsuarioEspecialista):Promise<any>
  {
    try
    {

      const userCredencial = await createUserWithEmailAndPassword(this.auth, nuevoUsuarioMail,nuevoUsuarioContra)
      const user = userCredencial.user;
      let col = collection(this.firestore, 'userInfo');

      await updateProfile(user, {displayName:usuario.rol});//agrego el rol en user.displayName
      
      console.log(user.displayName);

      await addDoc(col,
        {
          "id": user.uid,
          "nombre": usuario.nombre,
          "apellido": usuario.apellido,
          "edad": usuario.edad,
          "dni": usuario.dni,
          "especialidades": usuario.especialidades,
          "estado":usuario.estado
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
          if(user.displayName=='paciente' || user.displayName=='admin')
          {
            let col = collection(this.firestore, 'userinfo');
            
          }
        }
  
      }
      else
      {
        this.toast.danger("Verifique su cuenta con el link enviado a su casilla de correo.", "Error de verificacion", 3000);
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

}
