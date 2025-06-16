import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { EspecialistaService } from '../../../../services/especialista.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadService } from '../../../../services/disponibilidad.service';
import { MatButtonModule } from '@angular/material/button';
import { NgToastService } from 'ng-angular-popup';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-crear-disponibilidad',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            MatFormFieldModule,
            MatTimepickerModule],
  templateUrl: './crear-disponibilidad.component.html',
  styleUrl: './crear-disponibilidad.component.css'
})
export class CrearDisponibilidadComponent {

  formCrearDisponibilidad!:FormGroup;

  especialidades!: [];


  constructor(private especialista:EspecialistaService,
              private toast: NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { dia: string; especialistaId: string ; especialidades: []},
              private dialogRef: MatDialogRef<CrearDisponibilidadComponent>,
              private disponibilidadService: DisponibilidadService)
  {

  }

  ngOnInit(): void 
  {
    
    this.formCrearDisponibilidad = new FormGroup({

      especialidadesForm : new FormControl('', [Validators.required]),
      

    });


    this.especialidades = this.data.especialidades;
    console.log('data:',this.especialidades);
    


  }





  onSelectionChange(event: any) 
  {
    console.log('Especialidades seleccionadas:', this.formCrearDisponibilidad.value.especialidades);
    console.log('Especialidades form: ', this.formCrearDisponibilidad.value.especialidadesForm);
    
  }

  CrearDisponibilidad()
  {
    this.toast.success('creado')
  }

  Cancelar() {
    this.dialogRef.close(false);
  }



  get especialidadesRegistro()
  {
    return this.formCrearDisponibilidad.get('especialidadesForm');
  }


}
