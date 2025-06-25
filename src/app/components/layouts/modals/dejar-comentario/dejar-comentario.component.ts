import { Turno } from './../../../../models/turno';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TurnosService } from '../../../../services/turnos.service';
import { NgToastService } from 'ng-angular-popup';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../../../auth/login/login.component';

@Component({
  selector: 'app-dejar-comentario',
  imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule,
            MatButtonModule,
            MatFormFieldModule,

  ],
  templateUrl: './dejar-comentario.component.html',
  styleUrl: './dejar-comentario.component.css'
})
export class DejarComentarioComponent {

  form!:FormGroup;


  constructor(private turno:TurnosService,
              private toast:NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { idTurno: string; estado: string},
              private dialogRef: MatDialogRef<DejarComentarioComponent>
  ){}


  ngOnInit(): void {
    
    this.form = new FormGroup({
      comentario : new FormControl('', [Validators.required, Validators.pattern(/\S+/)])
    });

  }


  async dejarComentario()
  {
    console.log('FORM', this.form.valid);
    
    if(this.form.valid && this.data)
    {
      const form= this.form.value;
      
      await this.turno.dejarComentarioEnTurno(this.data.idTurno, form.comentario)
      await this.turno.cambiarEstadoDeTurno(this.data.idTurno, this.data.estado);
      this.dialogRef.close(false);

      if(this.data.estado=='cancelado')
      {
        this.toast.success('Turno cancelado');
      }
      else if(this.data.estado=='rechazado')
      {
        this.toast.success('Turno rechazado');
      }
      else
      {
         this.toast.success('Turno Finalizado');
      }

    }
    else
    {
      this.toast.danger('Escriba un comentario!');
    }

  }


  Cancelar() 
  {
    this.dialogRef.close(false);
  }



  get comentario()
  {
    return this.form.get('comentario');
  }

}
