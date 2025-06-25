import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Turno } from '../../../../models/turno';

@Component({
  selector: 'app-ver-comentario',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './ver-comentario.component.html',
  styleUrl: './ver-comentario.component.css'
})
export class VerComentarioComponent {



  constructor(@Inject(MAT_DIALOG_DATA) public data: { turno: Turno;},
              private dialogRef: MatDialogRef<VerComentarioComponent>)
              {}


  Cerrar() 
  {
    this.dialogRef.close(false);
  }
}
