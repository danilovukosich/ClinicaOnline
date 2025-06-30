import { Component, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { AuthService } from '../../../services/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IfRoleDirective } from '../../../directives/if-role.directive';

@Component({
    selector: 'app-home',
    imports: [MatButtonModule,
        FormsModule,
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIcon, MatSidenavModule,
        MatProgressSpinnerModule, CommonModule, RouterOutlet, RouterLink,IfRoleDirective],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    
})
export class HomeComponent {

    cargando:boolean=false;
    rol!:any;

    constructor(private auth:AuthService)
    {
        console.log(this.rol);
        
    }

    async ngOnInit() 
    {
        this.rol= await this.auth.GetRoleHome();   
    }

 

    


}
