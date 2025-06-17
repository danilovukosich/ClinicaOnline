import { Component, Inject } from '@angular/core';
import { Disponibilidad } from './../../../../models/disponibilidad';
import { CommonModule } from '@angular/common';
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
  selector: 'app-editar-disponibilidad',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            MatFormFieldModule,
            MatTimepickerModule],
  templateUrl: './editar-disponibilidad.component.html',
  styleUrl: './editar-disponibilidad.component.css'
})
export class EditarDisponibilidadComponent {

  formEditarDisponibilidad!:FormGroup;

  especialidades!: [];
  frecuencias:string[]=['60m', '40m', '30m'];
  frecuenciaSeleccionada!:string;
  horarioDesdeSeleccionado:string = '8:00';


  constructor(private especialista:EspecialistaService,
              private toast: NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: { disponibilidad: Disponibilidad; dia: string; especialistaId: string ; especialidades: []},
              private dialogRef: MatDialogRef<EditarDisponibilidadComponent>,
              private disponibilidadService: DisponibilidadService)
  {

  }

  ngOnInit(): void 
  {
    console.log(this.data.disponibilidad);
    
    this.formEditarDisponibilidad = new FormGroup({

      especialidadForm : new FormControl('', [Validators.required]),
      frecuenciaSeleccionadaForm : new FormControl('', [Validators.required]),
      horarioDesde : new FormControl({value:'', disabled:true }, [Validators.required]),
      horarioHasta : new FormControl({value:'', disabled:true }, [Validators.required])
    });


    this.especialidades = this.data.especialidades;
    console.log('data:',this.especialidades);
    
    // 1. Habilitar 'Desde' al seleccionar frecuencia
    this.formEditarDisponibilidad.get('frecuenciaSeleccionadaForm')?.valueChanges.subscribe(val => {
      if (val)
      {
        this.formEditarDisponibilidad.get('horarioDesde')?.enable();
      } 
      else 
      {
        this.formEditarDisponibilidad.get('horarioDesde')?.disable();
        this.formEditarDisponibilidad.get('horarioHasta')?.disable();
      }
    });

    // 2. Habilitar 'Hasta' al seleccionar 'Desde'
    this.formEditarDisponibilidad.get('horarioDesde')?.valueChanges.subscribe(desde => {
      if (desde) 
      {
        this.formEditarDisponibilidad.get('horarioHasta')?.enable();
        this.horarioDesdeSeleccionado=desde;
      } 
      else 
      {
        this.formEditarDisponibilidad.get('horarioHasta')?.disable();
      }
    });

    if(this.data)
    {
      this.setDisponibilidad(this.data.disponibilidad);
    }

  }

  setDisponibilidad(disponibilidad:Disponibilidad)
  {
    this.frecuenciaSeleccionada = disponibilidad.frecuencia + 'm'; // para el intervalo del picker

    this.formEditarDisponibilidad.patchValue({
      especialidadForm: disponibilidad.especialidad,
      frecuenciaSeleccionadaForm: disponibilidad.frecuencia + 'm',
      horarioDesde: this.convertirHoraAFechaCompleta(disponibilidad.horarioDesde),
      horarioHasta: this.convertirHoraAFechaCompleta(disponibilidad.horarioHasta),
    });

    // Habilita los campos que estaban deshabilitados
    this.formEditarDisponibilidad.get('horarioDesde')?.enable();
    this.formEditarDisponibilidad.get('horarioHasta')?.enable();
  }

  private convertirHoraAFechaCompleta(horaStr: string): Date {
    const [hora, minutos] = horaStr.split(':').map(Number);
    const ahora = new Date(); // la fecha de hoy
    ahora.setHours(hora, minutos, 0, 0);
    return ahora;
  }


  async EditarDisponibilidad()
  {

    const form= this.formEditarDisponibilidad.value;
    console.log(form);

    if(this.formEditarDisponibilidad.valid)
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
        
        await this.disponibilidadService.actualizarDisponibilidad(this.data.disponibilidad.id, disp);


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
    return this.formEditarDisponibilidad.get('especialidadForm');
  }

  get frecuenciaSeleccionadaForm()
  {
    return this.formEditarDisponibilidad.get('frecuenciaSeleccionadaForm');
  }

  get horarioDesde()
  {
    return this.formEditarDisponibilidad.get('horarioDesde');
  }

  get horarioHasta()
  {
    return this.formEditarDisponibilidad.get('horarioHasta');
  }
}
