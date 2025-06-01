import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha-18";
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { VerificarMailDialogComponent } from '../../layouts/modals/verificar-mail-dialog/verificar-mail-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Firestore } from '@angular/fire/firestore';
import { UsuarioPaciente } from '../../../models/usuario-paciente';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
    selector: 'app-register-paciente',
    imports: [MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIcon,
        MatSelectModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        CommonModule,
        MatDialogModule,
        MatProgressSpinnerModule],
    templateUrl: './register-paciente.component.html',
    styleUrl: './register-paciente.component.css'
})
export class RegisterPacienteComponent {

  formRegistro!:FormGroup;
  
  hide = true;//contraseña

  email!:string;
  password!:string;
  nombre!:string;
  apellido!:string;
  edad!:number;
  dni!:number;
  obraSocial!:string;
  rol:string= "paciente";

  cargando:boolean = false;//bandera de cargando para el spiner

  archivoSeleccionado!:File;


  constructor(  private router: Router, private dialog:MatDialog, private auth:AuthService, private toast: NgToastService, private firestore:Firestore)
  {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.formRegistro = new FormGroup({

      emailRegistro : new FormControl('', [Validators.required, Validators.email]),
      passwordRegistro : new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombreregistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      apellidoRegistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      edadRegistro : new FormControl('', [Validators.required,  Validators.min(0), Validators.max(99)]),
      dniRegistro : new FormControl('', [Validators.required, Validators.min(10000000), Validators.max(99999999)]),
      obraSocialRegistro : new FormControl('', [Validators.required]),

    });

  }




  OpenDialog()
  {
    this.dialog.open(VerificarMailDialogComponent);
  }


  token:boolean = false;

  executeRecaptchaVisible(token:any)
  {
    this.token = !this.token;

    console.log(this.token);
  }


  GoToLogin()
  {
    this.router.navigate(['/login']);
  }


  togglePasswordVisibility() 
  {
    this.hide = !this.hide;
  }



  async Register()//registro de paciente
  {
    
    if(this.formRegistro.valid)
    {
      if(this.token==true)
      {
        this.cargando=true;

        try
        {
          let usuario= new UsuarioPaciente(this.nombre, this.apellido, this.edad, this.dni, this. obraSocial, this.rol);
        
          console.log(usuario);

          //subo la foto

          
          
          await this.auth.RegisterPaciente(this.email, this.password, usuario, this.archivoSeleccionado);


          console.log("registro exitoso");
          
          this.OpenDialog();//dialog de verificacion de email
        }
        catch(e:any)
        {
          console.log(e);
        }
        finally
        {
          this.cargando=false;
        }
        
      }
      else
      {
        this.toast.danger("Verifica que no eres un robot!");
      }
      
    }
    else
    {
      console.log("no valido");
      this.toast.danger("Verificar formulario!", "ERROR");
    }

  }


  onFileSelected(event: any) 
  {
    const file = event.target.files[0];
    if (file) 
    {
      this.archivoSeleccionado = file;
      console.log(this.archivoSeleccionado);
    }
  }




  

  get emailRegistro()
  {
    return this.formRegistro.get('emailRegistro');
  }

  get passwordRegistro()
  {
    return this.formRegistro.get('passwordRegistro');
  }

  get nombreregistro()
  {
    return this.formRegistro.get('nombreregistro');
  }

  get apellidoRegistro()
  {
    return this.formRegistro.get('apellidoRegistro');
  }

  get edadRegistro()
  {
    return this.formRegistro.get('edadRegistro');
  }

  get dniRegistro()
  {
    return this.formRegistro.get('dniRegistro');
  }

  get obraSocialRegistro()
  {
    return this.formRegistro.get('obraSocialRegistro');
  }
  

}
