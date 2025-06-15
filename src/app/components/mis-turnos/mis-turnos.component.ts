import { Component, ViewChild } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { BadgesEstadosPipe } from '../../pipes/styles/badges-estados.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
@Component({
    selector: 'app-mis-turnos',
    imports: [MatListModule, MatTableModule, MatPaginatorModule, CommonModule, BadgesEstadosPipe, MatButtonModule, MatIcon],
    templateUrl: './mis-turnos.component.html',
    styleUrl: './mis-turnos.component.css'
})



export class MisTurnosComponent {


   displayedColumns: string[] = ['especialista', 'especialidad', 'fecha', 'horario', 'estado', 'accion'];

    dataSource = new MatTableDataSource<Turno>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    
}

export interface Turno {
  especialista: string;
  especialidad: string;
  fecha: string;
  horario: string;
  estado:string,
}

const ELEMENT_DATA: Turno[] = [
  { especialista: 'Dra. María Pérez', especialidad: 'Dermatología', fecha: '2025-06-20', horario: '10:00', estado: 'pendiente' },
  { especialista: 'Dr. Juan Gómez', especialidad: 'Cardiología', fecha: '2025-06-21', horario: '11:30', estado: 'confirmado' },
  { especialista: 'Dra. Lucía Fernández', especialidad: 'Pediatría', fecha: '2025-06-22', horario: '09:00', estado: 'cancelado' },
  { especialista: 'Dr. Tomás Rodríguez', especialidad: 'Neurología', fecha: '2025-06-23', horario: '15:00', estado: 'pendiente' },
  { especialista: 'Dra. Ana López', especialidad: 'Ginecología', fecha: '2025-06-24', horario: '08:30', estado: 'confirmado' },
  { especialista: 'Dr. Ricardo Torres', especialidad: 'Traumatología', fecha: '2025-06-25', horario: '12:45', estado: 'pendiente' },
  { especialista: 'Dra. Elena Ruiz', especialidad: 'Dermatología', fecha: '2025-06-26', horario: '13:30', estado: 'pendiente' },
  { especialista: 'Dr. Federico Castro', especialidad: 'Cardiología', fecha: '2025-06-27', horario: '10:15', estado: 'cancelado' },
  { especialista: 'Dra. Mónica Herrera', especialidad: 'Neurología', fecha: '2025-06-28', horario: '14:00', estado: 'confirmado' },
  { especialista: 'Dr. Javier Martínez', especialidad: 'Ginecología', fecha: '2025-06-29', horario: '16:30', estado: 'pendiente' },
  { especialista: 'Dra. Paula Díaz', especialidad: 'Pediatría', fecha: '2025-06-30', horario: '09:30', estado: 'confirmado' },
  { especialista: 'Dr. Martín Vázquez', especialidad: 'Traumatología', fecha: '2025-07-01', horario: '17:15', estado: 'cancelado' },
  { especialista: 'Dra. Gabriela Soto', especialidad: 'Dermatología', fecha: '2025-07-02', horario: '11:00', estado: 'pendiente' },
  { especialista: 'Dr. Nicolás Ríos', especialidad: 'Cardiología', fecha: '2025-07-03', horario: '10:45', estado: 'confirmado' },
  { especialista: 'Dra. Julieta Romero', especialidad: 'Neurología', fecha: '2025-07-04', horario: '13:00', estado: 'pendiente' }
];