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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DejarComentarioComponent } from '../layouts/modals/dejar-comentario/dejar-comentario.component';
@Component({
    selector: 'app-mis-turnos',
    imports: [MatListModule,
                    MatTableModule,
                    MatPaginatorModule,
                    CommonModule, BadgesEstadosPipe,
                    MatButtonModule,
                    MatIcon,
                    MatTooltipModule,
                    NombreEspecialistaCompletoPipe,
                    MatDialogModule],
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
                private toast:NgToastService,
                private dialog:MatDialog){}

    

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
        if(estado=='cancelado' || estado=='rechazado')
        {
            this.dialog.open(DejarComentarioComponent, {
                data:{
                    idTurno: idTurno,
                    estado: estado
                }
            });
        }
        else
        this.turnosService.cambiarEstadoDeTurno(idTurno, estado);
    }

    comentarioCancelar()
    {

    }

    verComentario()
    {

    }

    dejarResenia()
    {
        this.toast.success('dejar reseña');
    }

    verResenia()
    {
        this.toast.success('ver reseña');
    }

    calificarAtencion()
    {

    }

    completarEncuesta()
    {

    }


    
}
