import { Component, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { AuthService } from '../../../services/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [MatButtonModule,
        FormsModule,
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatSidenavModule,
        MatProgressSpinnerModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!:FormGroup;
  
  email!:string;
  password!:string;

  hide = true;

  cargando= false;

  @ViewChild('drawer') drawer!: MatDrawer;
  // constructor(private auth:AuthService){}


  constructor(private auth:AuthService){}


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.formLogin = new FormGroup({
      emailLogin : new FormControl('', [Validators.required, Validators.email]),
      passwordLogin : new FormControl('', [Validators.required])
    });

  }

  togglePasswordVisibility() 
  {
    this.hide = !this.hide;
  }

  AutoComplete(tipoUsuario:string):void
  {
    switch(tipoUsuario)
    {
      case 'admin':
        this.email="administrador@yopmail.com";
        this.password="123456";
        break;
      case 'especialista1':
        this.email="ezio@yopmail.com";
        this.password="123456";
        break;
      case 'especialista2':
        this.email="jimhawkins@yopmail.com";
        this.password="123456";
        break;
      case 'paciente1':
        this.email="paciente@yopmail.com";
        this.password="123456";
        break;
      case 'paciente2':
        this.email="familia@yopmail.com";
        this.password="123456";
        break;
      case 'paciente3':
        this.email="maxverstappen@yopmail.com";
        this.password="123456";
        break;


    }
    

    this.drawer.toggle();
  }

  async LogIn()
  {
    console.log("entro login");
    

    
    if(this.formLogin.valid)
    {
      this.cargando=true;
      console.log("entro if");
      try 
      {
        await this.auth.LogUser(this.formLogin.get('emailLogin')?.value, this.formLogin.get('passwordLogin')?.value); 
      } 
      catch (e:any) 
      {
        console.log(e);
      }
      finally
      {
        this.cargando=false;
      }


      
    }   

    
  }


  get emailLogin()
  {
    return this.formLogin.get('emailLogin');
  }

  get passwordLogin()
  {
    return this.formLogin.get('passwordLogin');
  }

  testAutocomlete()
  {
    this.email="danilovuk1001@yopmail.com";
    this.password="123456";

    this.drawer.toggle();
  }
  

}
