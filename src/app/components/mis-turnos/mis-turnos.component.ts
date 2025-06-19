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
    displayedColumns: string[] = ['especialista', 'especialidad', 'fecha', 'horario', 'estado', 'accion'];
    dataSource = new MatTableDataSource<Turno>(ELEMENT_DATA);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    //Variables
    turnos!:any[];

    userId!:any;

    constructor(private turnosService:TurnosService, private auth:AuthService){}

    ngAfterViewInit() 
    {
        this.dataSource.paginator = this.paginator;
    }

    async ngOnInit() 
    {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.userId = await this.auth.GetUserId();

        this.turnosService.getTurnosPaciente(this.userId).subscribe((tunnos:any[])=>{
            this.turnos = tunnos;
            console.log(this.turnos);
            
        });
    }
    


    
}


const ELEMENT_DATA: Turno[] = [
    { especialistaId: 'María Pérez', especialidadId: 'Dermatología', fecha: '2025-06-20', hora: '10:00', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Juan Gómez', especialidadId: 'Cardiología', fecha: '2025-06-21', hora: '11:30', estado: 'aceptado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Lucía Fernández', especialidadId: 'Pediatría', fecha: '2025-06-22', hora: '09:00', estado: 'cancelado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Tomás Rodríguez', especialidadId: 'Neurología', fecha: '2025-06-23', hora: '15:00', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Ana López', especialidadId: 'Ginecología', fecha: '2025-06-24', hora: '08:30', estado: 'aceptado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Ricardo Torres', especialidadId: 'Traumatología', fecha: '2025-06-25', hora: '12:45', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Elena Ruiz', especialidadId: 'Dermatología', fecha: '2025-06-26', hora: '13:30', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Federico Castro', especialidadId: 'Cardiología', fecha: '2025-06-27', hora: '10:15', estado: 'cancelado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Mónica Herrera', especialidadId: 'Neurología', fecha: '2025-06-28', hora: '14:00', estado: 'aceptado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Javier Martínez', especialidadId: 'Ginecología', fecha: '2025-06-29', hora: '16:30', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Paula Díaz', especialidadId: 'Pediatría', fecha: '2025-06-30', hora: '09:30', estado: 'aceptado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Martín Vázquez', especialidadId: 'Traumatología', fecha: '2025-07-01', hora: '17:15', estado: 'cancelado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Gabriela Soto', especialidadId: 'Dermatología', fecha: '2025-07-02', hora: '11:00', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Nicolás Ríos', especialidadId: 'Cardiología', fecha: '2025-07-03', hora: '10:45', estado: 'aceptado', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' },
    { especialistaId: 'Julieta Romero', especialidadId: 'Neurología', fecha: '2025-07-04', hora: '13:00', estado: 'pendiente', diaDeSemana:1, timestamp:124312, solicitanteId:'aljksdnfas' }
];