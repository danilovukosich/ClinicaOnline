import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { Disponibilidad } from '../../../../models/disponibilidad';
import { DisponibilidadService } from '../../../../services/disponibilidad.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-eliminar-disponibilidad',
  imports: [CommonModule, 
        MatIconModule, 
        MatProgressSpinnerModule, 
        MatButtonModule,
        MatDialogModule,
        MatSelectModule],
  templateUrl: './eliminar-disponibilidad.component.html',
  styleUrl: './eliminar-disponibilidad.component.css'
})
export class EliminarDisponibilidadComponent {

   constructor(
              private toast: NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { disponibilidad: Disponibilidad; dia: string;},
              private dialogRef: MatDialogRef<EliminarDisponibilidadComponent>,
              private disponibilidadService: DisponibilidadService){

  }

  Cancelar() 
  {
    this.dialogRef.close(false);
  }


  async eliminar()
  {
    await this.disponibilidadService.eliminarDisponibilidad(this.data.disponibilidad.id);
    this.toast.success("¡Disponibilidad eliminada!")
    this.dialogRef.close(false);
  }

}
