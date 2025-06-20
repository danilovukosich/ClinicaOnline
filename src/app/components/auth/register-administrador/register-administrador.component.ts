import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-18';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioAdmnistrador } from '../../../models/usuario-admnistrador';

@Component({
  selector: 'app-register-administrador',
  imports: [
    MatButtonModule,
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
        MatProgressSpinnerModule
  ],
  templateUrl: './register-administrador.component.html',
  styleUrl: './register-administrador.component.css'
})
export class RegisterAdministradorComponent {


  formRegistro!:FormGroup;
  
  hide = true;//contraseña

  email!:string;
  password!:string;
  nombre!:string;
  apellido!:string;
  edad!:number;
  dni!:number;
  obraSocial!:string;
  rol:string= "admin";
  

  

  cargando:boolean = false;//bandera de cargando para el spiner
  submitted:boolean=false;

  archivoSeleccionado!: File;


  constructor(private router: Router,
              private dialog:MatDialog,
              private auth:AuthService, 
              private toast: NgToastService, 
              private firestore:Firestore,
              private fb:FormBuilder,
              private storageService:StorageService,
              private dialogRef:MatDialogRef<RegisterAdministradorComponent>
            ){}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.formRegistro = new FormGroup({

      emailRegistro : new FormControl('', [Validators.required, Validators.email]),
      passwordRegistro : new FormControl('', [Validators.required, Validators.minLength(6)]),
      nombreregistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      apellidoRegistro : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      edadRegistro : new FormControl('', [Validators.required,  Validators.min(23), Validators.max(99)]),
      dniRegistro : new FormControl('', [Validators.required, Validators.min(10000000), Validators.max(99999999)]),
      archivoSeleccionadoRegistro : new FormControl('', [Validators.required]),

    });

  }

    
    token:boolean = false;
  
    executeRecaptchaVisible(token:any)
    {
      this.token = !this.token;
    }
  
  
    togglePasswordVisibility() 
    {
      this.hide = !this.hide;
    }
  
  
  
    async Register()//registro de paciente
    {
      this.submitted=true;
      if(this.formRegistro.valid)
      {
        if(this.token==true)
        {
          this.cargando=true;
  
          try
          {
            let usuario= new UsuarioAdmnistrador(this.nombre, this.apellido, this.edad, this.dni, this.rol);
  
            await this.auth.RegisterAdministrador(this.email, this.password, usuario, this.archivoSeleccionado);
            this.dialogRef.close();
            
            this.toast.success("Registro exitoso!");
            
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
        console.log(this.formRegistro);
        console.log(this.formRegistro.status); // Muestra si el formulario es 'VALID' o 'INVALID'
        console.log(this.formRegistro.errors); // Muestra los errores del formulario, si hay
  
        
        this.toast.danger("Verificar formulario!", "ERROR");
      }
  
    }
  
  
    nombreArchivoSeleccionado: string = '';
    onFileSelected(event: any) 
    {
      const file = event.target.files[0];
      if (file) 
      {
        this.archivoSeleccionado = file;
        this.nombreArchivoSeleccionado = file.name;
  
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
  
    get archivoSeleccionadoRegistro()
    {
      return this.formRegistro.get('archivoSeleccionadoRegistro');
    }

}
