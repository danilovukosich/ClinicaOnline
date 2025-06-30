import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TurnosService } from '../../../../services/turnos.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-calificar-atencion',
  imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule,
            MatButtonModule,
            MatFormFieldModule,
            MatSliderModule],
  templateUrl: './calificar-atencion.component.html',
  styleUrl: './calificar-atencion.component.css'
})
export class CalificarAtencionComponent {

  form!:FormGroup;


  constructor(private turno:TurnosService,
              private toast:NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { idTurno: string; estado: string},
              private dialogRef: MatDialogRef<CalificarAtencionComponent>
  ){}

  
  ngOnInit(): void {
    
    this.form = new FormGroup({
      calificacion : new FormControl('', [Validators.required])
    });

  }

  CalificarAtencion()
  {
    
    
    this.form.markAllAsTouched();
    
    if(this.form.valid)
    {
      
      this.toast.success('Atencion calificada!');
      this.dialogRef.close(false);

    }
  }

  Cerrar() 
  {
    this.dialogRef.close(false);
  }

  get calificacion()
  {
    return this.form.get('calificacion');
  }

}
