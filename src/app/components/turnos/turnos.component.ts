import { orderBy } from '@angular/fire/firestore';
import { Component, ViewChild } from '@angular/core';
import { DejarComentarioComponent } from '../layouts/modals/dejar-comentario/dejar-comentario.component';
import { VerComentarioComponent } from '../layouts/modals/ver-comentario/ver-comentario.component';
import { Turno } from '../../models/turno';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { BadgesEstadosPipe } from '../../pipes/styles/badges-estados.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NombreEspecialistaCompletoPipe } from '../../pipes/cast/nombre-especialista-completo.pipe';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-turnos',
  imports: [MatListModule,
                MatTableModule,
                MatPaginatorModule,
                CommonModule, BadgesEstadosPipe,
                MatButtonModule,
                MatIcon,
                MatTooltipModule,
                NombreEspecialistaCompletoPipe,
                MatDialogModule,
                MatInputModule,],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent {


   //Tabla
    
    //Variables
    turnos!:any[];
    rol!:string | null;
    userId!:any;
    dataSource = new MatTableDataSource<Turno>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    displayedColumns: string[] = ['especialista', 'paciente', 'especialidad', 'fecha', 'horario', 'estado', 'accion'];

    constructor(private turnosService:TurnosService, 
                private auth:AuthService,
                private toast:NgToastService,
                private dialog:MatDialog){}

    

    async ngOnInit() 
    {
        
        this.userId = await this.auth.GetUserId();
        this.rol= await this.auth.GetRoleHome();

        this.turnosService.getTodosTurnosConHistoria().subscribe((turnos:any[])=>{

            const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);

            this.turnos = turnosOrdenados;
            this.dataSource = new MatTableDataSource<Turno>(turnos); 
            this.dataSource.paginator = this.paginator;   
            console.log(this.turnos, this.dataSource);

            this.dataSource.filterPredicate = (data: Turno, filter: string) => {
                const dataStr = JSON.stringify(data).toLowerCase();
                return dataStr.includes(filter);
            };

        });
        
    }




    applyFilter(event: Event) 
    {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
    }

    ngAfterViewInit() 
    {
        this.dataSource.paginator = this.paginator;
    }
    

    cambiarEstadoTurno(idTurno:string, estado:string)
    {
        if(estado=='cancelado' || estado=='rechazado' || estado == 'finalizado')
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


    verComentario(turno:Turno)
    {
        this.dialog.open(VerComentarioComponent, {
                data:{
                    turno: turno
                }
            });
    }



}
