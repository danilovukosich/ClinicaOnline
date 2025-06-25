import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cargar-historia-clinica',
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            MatFormFieldModule,
            MatTimepickerModule],
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrl: './cargar-historia-clinica.component.css'
})
export class CargarHistoriaClinicaComponent {

  constructor(private toast: NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { dia: string},
              private dialogRef: MatDialogRef<CargarHistoriaClinicaComponent>)
  {

  }



  Cancelar() 
  {
    this.dialogRef.close(false);
  }

}
