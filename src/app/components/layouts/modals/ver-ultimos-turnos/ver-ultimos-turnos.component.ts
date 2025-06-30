import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BadgesEstadosPipe } from '../../../../pipes/styles/badges-estados.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NombreEspecialistaCompletoPipe } from '../../../../pipes/cast/nombre-especialista-completo.pipe';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TurnosService } from '../../../../services/turnos.service';
import { AuthService } from '../../../../services/auth.service';
import { Turno } from '../../../../models/turno';
import { VerHistoriaClinicaComponent } from '../ver-historia-clinica/ver-historia-clinica.component';

@Component({
  selector: 'app-ver-ultimos-turnos',
  imports: [CommonModule,
            MatListModule,
            MatTableModule,
            MatPaginatorModule,
            BadgesEstadosPipe,
            MatButtonModule,
            MatIconModule,
            NombreEspecialistaCompletoPipe,
            MatDialogModule,
            MatInputModule,
  ],
  templateUrl: './ver-ultimos-turnos.component.html',
  styleUrl: './ver-ultimos-turnos.component.css'
})
export class VerUltimosTurnosComponent {


  turnos!:any[];
   displayedColumns: string[] = ['especialista', 'especialidad', 'fecha', 'horario', 'estado'];
  dataSource = new MatTableDataSource<Turno>();

  constructor(private turnosService:TurnosService, 
               @Inject(MAT_DIALOG_DATA) public data: { pacienteId: any; especialistaId:any},
              private dialogRef: MatDialogRef<VerHistoriaClinicaComponent>,){}


  ngOnInit(): void {
    

    console.log('DATOSSSS',this.data.pacienteId, this.data.especialistaId);
    
    this.turnosService.getTurnosPacienteConEspecialista(this.data.pacienteId, this.data.especialistaId).subscribe((turnos:any[])=>{

      const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);
      const ultimosTresTurnos = turnosOrdenados.slice(0, 3);
      this.turnos = ultimosTresTurnos;

      this.dataSource = new MatTableDataSource<Turno>(ultimosTresTurnos);  
      console.log(this.turnos, this.dataSource);

      this.dataSource.filterPredicate = (data: Turno, filter: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.includes(filter);
      };

    });
    
  }

  
  Cerrar() 
  {
    this.dialogRef.close(false);
  }

}
