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
  standalone: true,
  imports: [MatButtonModule,
    FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatSidenavModule,
    MatProgressSpinnerModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!:FormGroup;
  formRegistro!:FormGroup;
  
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


    this.formRegistro = new FormGroup({
      emailRegistro : new FormControl('', [Validators.required, Validators.email]),
      passwordRegistro : new FormControl('', [Validators.required]),
      rol : new FormControl('', [Validators.required])
    });

  }


  openSidenav() {
    this.drawer.toggle();
  }

  togglePasswordVisibility() 
  {
    this.hide = !this.hide;
  }

  AutoComplete(tipoUsuario:string):void
  {
    if(tipoUsuario=='admin')
    {
      this.email="admin@admin.com";
      this.password="123456";
    }
    else
    {
      this.email="user@user.com";
      this.password="123456";
    }
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

  Register()
  {
    if(this.formRegistro.valid)
    {
      // this.auth.Register(this.formRegistro.get('emailRegistro')?.value, this.formRegistro.get('passwordRegistro')?.value);
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
