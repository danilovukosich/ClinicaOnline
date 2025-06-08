import { Observable, timeout } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-mi-perfil',
    imports: [CommonModule, MatIcon],
    templateUrl: './mi-perfil.component.html',
    styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

    
    user:any;
    userInfo$: Observable<any>;
    imagen2!:string;
    fondoDePortada: string = 'https://cdn.wallpapersafari.com/30/78/5j8kxe.jpg';

    constructor(private authService: AuthService)
    {
       console.log('hola');
       this.user=this.authService.GetUser();
       this.userInfo$ = this.authService.GetUserInfo();
       console.log(this.user);
       this.userInfo$.subscribe(userInfo => {
           console.log('Datos del usuario:', userInfo);
            this.imagen2=userInfo.imagen2;
           });

       
       
      
    }

    ngOnInit(): void {
        
        setTimeout(()=>{
        
            this.user=this.authService.GetUser();
            this.userInfo$ = this.authService.GetUserInfo();
            console.log(this.user);
            this.userInfo$.subscribe(userInfo => {
                console.log('Datos del usuario:', userInfo);
                this.imagen2=userInfo.imagen2;
                });
            ;
      },500);


    }
    
    


}
