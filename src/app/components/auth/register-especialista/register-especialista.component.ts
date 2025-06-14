import { Component, Optional } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha-18";
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { VerificarMailDialogComponent } from '../../layouts/modals/verificar-mail-dialog/verificar-mail-dialog.component';
import { AuthService } from '../../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Firestore } from '@angular/fire/firestore';
import { UsuarioPaciente } from '../../../models/usuario-paciente';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UsuarioEspecialista } from '../../../models/usuario-especialista';
import { StorageService } from '../../../services/storage.service';
import { RegisterPacienteComponent } from '../register-paciente/register-paciente.component';
import { EspecialistaService } from '../../../services/especialista.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-register-especialista',
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
    templateUrl: './register-especialista.component.html',
    styleUrl: './register-especialista.component.css'
})
export class RegisterEspecialistaComponent {

  formRegistro!:FormGroup;
  
  hide = true;//contraseña

  email!:string;
  password!:string;
  nombre!:string;
  apellido!:string;
  edad!:number;
  dni!:number;
  obraSocial!:string;
  rol:string= "especialista";
  estado:number=0;

  especialidades!: Observable<any[]>;
  nuevaEspecialidad: string = '';

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
              private especialista:EspecialistaService,
              @Optional() private dialogRef?:MatDialogRef<RegisterPacienteComponent>
            )
  {
    this.formRegistro = this.fb.group({
      especialidades: [[]] // Inicializa con un array vacío
    });

     this.especialidades = this.especialista.GetEspecialidades();

  }

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
      especialidadesRegistro : new FormControl('', [Validators.required]),
      nuevaEspecialidadRegistro : new FormControl(''),
      archivoSeleccionadoRegistro : new FormControl('', [Validators.required]),

    });

    

  }


  onSelectionChange(event: any) {
    console.log('Especialidades seleccionadas:', this.formRegistro.value.especialidades);
    console.log('Especialidades form: ', this.formRegistro.value.especialidadesRegistro);
    
  }

  // Agregar nueva especialidad
  agregarEspecialidad() 
  {
    const especialidad = this.formRegistro?.value.nuevaEspecialidadRegistro.trim();
    
      if(especialidad)
      {
        
        this.especialista.AddEspecialidad(especialidad);
        this.nuevaEspecialidad=''; // Limpia el campo

        
      }
      else
      {
        this.toast.warning('Especialidad vacia!')
      }
    

    console.log(this.especialidades);
    
  }

  traerEspecialidades()
  {
    this.especialidades=this.especialista.GetEspecialidades();
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
    this.submitted=true;
    if(this.formRegistro.valid)
    {
      if(this.token==true)
      {
        this.cargando=true;

        try
        {
          let usuario= new UsuarioEspecialista(this.nombre, this.apellido, this.edad, this.dni, this.formRegistro.value.especialidadesRegistro,this.estado, this.rol);
        
          const rolActual=this.auth.GetRole();

          if(rolActual!='admin')
          {
            await this.auth.RegisterEspecialista(this.email, this.password, usuario, this.archivoSeleccionado);
  
            console.log("registro exitoso");
            this.OpenDialog();//dialog de verificacion de email
            this.router.navigate(['/login']);

          }
          else
          {
            await this.auth.RegisterEspecialistaAdministrador(this.email, this.password, usuario, this.archivoSeleccionado);
            
            if(this.dialogRef)
            {
              this.dialogRef.close();
            }
          }

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

  get obraSocialRegistro()
  {
    return this.formRegistro.get('obraSocialRegistro');
  }


  get especialidadesRegistro()
  {
    return this.formRegistro.get('especialidadesRegistro');
  }

  get archivoSeleccionadoRegistro()
  {
    return this.formRegistro.get('archivoSeleccionadoRegistro');
  }



  

 


}
