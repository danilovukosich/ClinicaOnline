import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
    selector: 'app-usuarios',
    imports: [MatCardModule, MatButtonModule, MatTabsModule],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

    pacientes!:any;
    especialistas!:any;
    administradores!:any;



    constructor(private usuarios:UsuariosService)
    {

    }

    ngOnInit(): void {
       
        this.usuarios.GetUsuarios('paciente').subscribe((usuarios:any[])=>{
            this.pacientes = usuarios;
            console.log('PACIENTES:', this.pacientes);
            
        });
        this.usuarios.GetUsuarios('especialista').subscribe((usuarios:any[])=>{
            this.especialistas = usuarios;
            console.log('ESPECIALISTAS:', this.especialistas);
        });
        this.usuarios.GetUsuarios('admin').subscribe((usuarios:any[])=>{
            this.administradores = usuarios;
            console.log('ADMINISTRADORES:', this.administradores);
        });
        
    }


    DarBajaUsuario(id:any)
    {
        this.usuarios.SetEstadoCero(id);
    }

    DarAltaUsuario(id:any)
    {
        this.usuarios.SetEstadoUno(id);
    }

}
