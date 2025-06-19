import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TurnosService } from '../../../../services/turnos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Turno } from '../../../../models/turno';
import { MatButtonModule } from '@angular/material/button';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-confirmar-turno',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './confirmar-turno.component.html',
  styleUrl: './confirmar-turno.component.css'
})
export class ConfirmarTurnoComponent {

  turnoSeleccionado!:Turno;
  constructor(private turnosService:TurnosService,
              private toast:NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { turno: Turno},
              private dialogRef: MatDialogRef<ConfirmarTurnoComponent>,
  )
  {
    this.turnoSeleccionado=data.turno;
    console.log("HOLA", this.turnoSeleccionado);
    
  }

  Cancelar() 
  {
    this.dialogRef.close(false);
  }

  async CrearTurno()
  {

    if(!this.turnoSeleccionado)
    {
      this.toast.danger("No selecciono turno");
      return;
    }

    try {
      
      await this.turnosService.generarTurno(this.turnoSeleccionado);
      this.toast.success("Turno agendado");
      this.dialogRef.close(false);
      
    } catch (error) {
      this.toast.danger("Error al agendar el turno");
      this.dialogRef.close(false);
    }

  }


  

}
