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


@Component({
  selector: 'app-register-paciente',
  standalone: true,
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
            MatDialogModule],
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
  edad!:string;
  dni!:number;
  obraSocial!:string;
  rol:string= "paciente";

  constructor(  private router: Router, private dialog:MatDialog, private auth:AuthService, private toast: NgToastService)
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



  Register()
  {
    
    
    if(this.formRegistro.valid)
    {
      if(this.token==true)
      {
        console.log("registro exitoso");
        
        //this.auth.Register(this.formRegistro.get('emailRegistro')?.value, this.formRegistro.get('passwordRegistro')?.value);
        
        this.OpenDialog();//dialog de verificacion de email
      }
      else
      {
        this.toast.danger("Verificar que no eres un robot!", "ERROR");
      }
      
    }
    else
    {
      console.log("no valido");
      this.toast.danger("Verificar formulario!", "ERROR");
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
