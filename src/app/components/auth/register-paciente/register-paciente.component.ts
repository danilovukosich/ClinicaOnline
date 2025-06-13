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
  submitted = false;

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
  archivoSeleccionado2!:File;

  nombreArchivoSeleccionado: string = '';
  nombreArchivoSeleccionado2: string = '';


  constructor(  private router: Router, private dialog:MatDialog, private auth:AuthService, private toast: NgToastService, private firestore:Firestore)
  {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements 2OnInit' to the class.
    
     
    this.formRegistro = new FormGroup({

      emailRegistro : new FormControl('', [Validators.required, Validators.email]),
      passwordRegistro : new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombreregistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      apellidoRegistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      edadRegistro : new FormControl('', [Validators.required,  Validators.min(0), Validators.max(99)]),
      dniRegistro : new FormControl('', [Validators.required, Validators.min(10000000), Validators.max(99999999)]),
      obraSocialRegistro : new FormControl('', [Validators.required]),
      archivoSeleccionadoRegistro : new FormControl('', [Validators.required]),
      archivoSeleccionado2Registro : new FormControl('', [Validators.required]),

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



  async Register()
  {
    console.log(this.auth);
    
    this.submitted = true;

    if(this.formRegistro.valid)
    {
      if(this.token==true)
      {
        this.cargando=true;

        try
        {
          let usuario= new UsuarioPaciente(this.nombre, this.apellido, this.edad, this.dni, this. obraSocial, this.rol);
        
          // console.log(usuario);
          // console.log('Acrchivo 1',this.archivoSeleccionado);
          // console.log('Acrchivo 2',this.archivoSeleccionado2);
          
          const rolActual=this.auth.GetRole();

          
          if(rolActual!='admin')
          { 
            await this.auth.RegisterPaciente(this.email, this.password, usuario, this.archivoSeleccionado, this.archivoSeleccionado2);
            this.OpenDialog();
            this.router.navigate(['/login']);
          }
          else
          {
            await this.auth.RegisterPacienteAdministrador(this.email, this.password, usuario, this.archivoSeleccionado, this.archivoSeleccionado2);
          }
          

          console.log("registro exitoso");
          
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
      this.toast.danger("Verificar formulario!", "ERROR");
    }

  }

  
  onFileSelected(event: any, tipo: 'perfil'|'portada') 
  {
    const file = event.target.files[0];

    if (file) 
    {
        if (tipo === 'perfil') {
            this.archivoSeleccionado = file;
            this.nombreArchivoSeleccionado = file.name;
            console.log(this.archivoSeleccionado);
        } 
        else if (tipo === 'portada') {
            this.archivoSeleccionado2 = file;
            this.nombreArchivoSeleccionado2 = file.name;
        }
    } 
    else
    {
        if (tipo === 'perfil') {
            this.nombreArchivoSeleccionado = '';
        } 
        else if (tipo === 'portada') {
            this.nombreArchivoSeleccionado2 = '';
        }
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

  get archivoSeleccionadoRegistro()
  {
    return this.formRegistro.get('archivoSeleccionadoRegistro');
  }

  get archivoSeleccionado2Registro()
  {
    return this.formRegistro.get('archivoSeleccionado2Registro');
  }
  

}
