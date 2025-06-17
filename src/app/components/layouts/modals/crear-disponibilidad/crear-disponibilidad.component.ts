import { Disponibilidad } from './../../../../models/disponibilidad';
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
  frecuencias:string[]=['60m', '40m', '30m'];
  frecuenciaSeleccionada!:string;
  horarioDesdeSeleccionado:string = '8:00';


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

      especialidadForm : new FormControl('', [Validators.required]),
      frecuenciaSeleccionadaForm : new FormControl('', [Validators.required]),
      horarioDesde : new FormControl({value:'', disabled:true }, [Validators.required]),
      horarioHasta : new FormControl({value:'', disabled:true }, [Validators.required])
    });


    this.especialidades = this.data.especialidades;
    console.log('data:',this.especialidades);
    
    // 1. Habilitar 'Desde' al seleccionar frecuencia
    this.formCrearDisponibilidad.get('frecuenciaSeleccionadaForm')?.valueChanges.subscribe(val => {
      if (val)
      {
        this.formCrearDisponibilidad.get('horarioDesde')?.enable();
      } 
      else 
      {
        this.formCrearDisponibilidad.get('horarioDesde')?.disable();
        this.formCrearDisponibilidad.get('horarioHasta')?.disable();
      }
    });

    // 2. Habilitar 'Hasta' al seleccionar 'Desde'
    this.formCrearDisponibilidad.get('horarioDesde')?.valueChanges.subscribe(desde => {
      if (desde) 
      {
        this.formCrearDisponibilidad.get('horarioHasta')?.enable();
        this.horarioDesdeSeleccionado=desde;
      } 
      else 
      {
        this.formCrearDisponibilidad.get('horarioHasta')?.disable();
      }
    });


  }


  async CrearDisponibilidad()
  {

    const form= this.formCrearDisponibilidad.value;
    console.log(form);

    if(this.formCrearDisponibilidad.valid)
    {

      let disp: Disponibilidad = {
        especialistaId: this.data.especialistaId,
        especialidad: form.especialidadForm,
        dia: this.data.dia,
        frecuencia: parseInt(form.frecuenciaSeleccionadaForm.replace('m', '')),
        horarioDesde: this.ExtraerHora(form.horarioDesde),
        horarioHasta: this.ExtraerHora(form.horarioHasta),
      };

      console.log('DISP',disp);
      

      try 
      {
        
        await this.disponibilidadService.crearDisponibilidad(disp);


        this.toast.success('Horarios para el ' + this.data.dia + " creados", "", 3000)
        this.dialogRef.close(false);

      } 
      catch (error) 
      {
        this.toast.danger("Error al guardar disponibilidad");
        console.error("Error creando disponibilidad:", error);
      }


    }
    else
    {
      this.toast.danger("Verificar Formulario")
    }
  }

  Cancelar() 
  {
    this.dialogRef.close(false);
  }


  ExtraerHora(fecha: Date): string {
  return fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}


  get especialidadForm()
  {
    return this.formCrearDisponibilidad.get('especialidadForm');
  }

  get frecuenciaSeleccionadaForm()
  {
    return this.formCrearDisponibilidad.get('frecuenciaSeleccionadaForm');
  }

  get horarioDesde()
  {
    return this.formCrearDisponibilidad.get('horarioDesde');
  }

  get horarioHasta()
  {
    return this.formCrearDisponibilidad.get('horarioHasta');
  }


}
