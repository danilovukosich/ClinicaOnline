import { Component, ViewChild } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule,
    FormsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatSidenavModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin!:FormGroup;
  formRegistro!:FormGroup;
  
  email!:string;
  password!:string;

  hide = true;

  @ViewChild('drawer') drawer!: MatDrawer;
  // constructor(private auth:AuthService){}

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

  LogIn()
  {
    if(this.formLogin.valid)
    {
      // this.auth.LogUser(this.formLogin.get('emailLogin')?.value, this.formLogin.get('passwordLogin')?.value); 
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

  

}
