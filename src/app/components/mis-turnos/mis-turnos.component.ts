import { Turno } from './../../models/turno';
import { Component, ViewChild } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { BadgesEstadosPipe } from '../../pipes/styles/badges-estados.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NombreEspecialistaCompletoPipe } from '../../pipes/cast/nombre-especialista-completo.pipe';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
    selector: 'app-mis-turnos',
    imports: [MatListModule,
                    MatTableModule,
                    MatPaginatorModule,
                    CommonModule, BadgesEstadosPipe,
                    MatButtonModule,
                    MatIcon,
                    MatTooltipModule,
                    NombreEspecialistaCompletoPipe],
    templateUrl: './mis-turnos.component.html',
    styleUrl: './mis-turnos.component.css'
})

export class MisTurnosComponent {

    //Tabla
    
    //Variables
    turnos!:any[];
    rol!:string | null;
    userId!:any;
    dataSource = new MatTableDataSource<Turno>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    displayedColumns: string[] = ['especialista', 'especialidad', 'fecha', 'horario', 'estado', 'accion'];

    constructor(private turnosService:TurnosService, 
                private auth:AuthService,
                private toast:NgToastService){}

    

    async ngOnInit() 
    {
        
        this.userId = await this.auth.GetUserId();
        this.rol= await this.auth.GetRoleHome();




        if(this.rol=='paciente')
        {
            this.turnosService.getTurnosPaciente(this.userId).subscribe((turnos:any[])=>{
                this.turnos = turnos;
                this.dataSource = new MatTableDataSource<Turno>(turnos); 
                this.dataSource.paginator = this.paginator;   
                console.log(this.turnos, this.dataSource);
            });
        }
        else if(this.rol=='especialista')
        {
            this.turnosService.getTurnosEspecialista(this.userId).subscribe((turnos:any[])=>{
                this.turnos = turnos;
                this.dataSource = new MatTableDataSource<Turno>(turnos); 
                this.dataSource.paginator = this.paginator;   
                console.log(this.turnos);
            });
        }
    }

    ngAfterViewInit() 
    {
        this.dataSource.paginator = this.paginator;
    }
    

    cambiarEstadoTurno(idTurno:string, estado:string)
    {
        this.turnosService.cambiarEstadoDeTurno(idTurno, estado);
    }

    comentarioCancelar()
    {

    }

    dejarResenia()
    {
        this.toast.success('reseña')
    }

    
}
