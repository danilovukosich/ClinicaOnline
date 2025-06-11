import { Observable, timeout } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-mi-perfil',
    imports: [CommonModule, MatIcon, MatProgressSpinnerModule],
    templateUrl: './mi-perfil.component.html',
    styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

    
    cargando:boolean=false;

    user:any;
    userInfo$: Observable<any>;
    imagen2!:string;
    fondoDePortada: string = 'https://cdn.wallpapersafari.com/30/78/5j8kxe.jpg';

    constructor(private authService: AuthService)
    {
      
       this.user=this.authService.GetUser();
       this.userInfo$ = this.authService.GetUserInfo();
    
       
       

       
       
      
    }

    ngOnInit(): void {
        
        this.cargando=true

        this.userInfo$.subscribe({
            next: (userInfo) => {
                console.log('Datos del usuario recibidos:', userInfo);
                this.imagen2 = userInfo.imagen2;
                this.cargando = false; 
                console.log('Spinner visible: false (datos cargados)');
            },
            error: (err) => {
                console.error('Error al obtener datos del usuario:', err);
                this.cargando = false;
                console.log('Spinner visible: false (error)');
            }
        });


    }
    
    


}
