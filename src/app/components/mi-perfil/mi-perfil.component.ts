import { Observable } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mi-perfil',
    imports: [CommonModule],
    templateUrl: './mi-perfil.component.html',
    styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

    
    user:any;
    userInfo$: Observable<any>;

    constructor(private authService: AuthService)
    {
        this.user=this.authService.GetUser();
        this.userInfo$ = this.authService.GetUserInfo();
        console.log(this.user);
        this.userInfo$.subscribe(userInfo => {
            console.log('Datos del usuario:', userInfo);
            });
        
        
    }
    


}
