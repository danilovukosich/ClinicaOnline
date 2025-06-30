import { Turno } from './../../../../models/turno';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NgToastService } from 'ng-angular-popup';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { HistoriaClinica } from '../../../../models/historia-clinica';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-cargar-historia-clinica',
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            MatInputModule,
            MatSelectModule,
            MatButtonModule,
            MatFormFieldModule,
            MatTimepickerModule,
            MatProgressSpinnerModule],
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrl: './cargar-historia-clinica.component.css'
})
export class CargarHistoriaClinicaComponent {


  form!:FormGroup;

  keyDinamico1:string = '';
  keyDinamico2:string = '';
  keyDinamico3:string = '';
  valueDinamico1:any = '';
  valueDinamico2:any = '';
  valueDinamico3:any = '';

  isLoading = false;


  constructor(private toast: NgToastService,
              private historiaClinicaService:HistoriaClinicaService,
              @Inject(MAT_DIALOG_DATA) public data: { turno: Turno},
              private dialogRef: MatDialogRef<CargarHistoriaClinicaComponent>)
  {

  }

  ngOnInit(): void 
  {

    this.form = new FormGroup({
      altura : new FormControl('', [Validators.required, Validators.min(20), Validators.max(300)]),
      peso : new FormControl('', [Validators.required, Validators.min(1), Validators.max(350)]),
      temperatura : new FormControl('', [Validators.required, Validators.min(30), Validators.max(45)]),
      presion : new FormControl('', [Validators.required, Validators.pattern(/^\d{2,3}\/\d{2,3}$/)]),
      campoDinamicoUno: new FormControl(''),
      campoDinamicoDos: new FormControl(''),
      campoDinamicoTres: new FormControl(''),
    });

    console.log('Turno', this.data.turno);
    
    
  }

  async cargarHistoriaClinica()
  {

    if (this.form.invalid) 
    {
      this.toast.danger('Complete correctamente los campos');
      return;
    }
    
    this.isLoading = true;

    let fecha = new Date()

    const historia: HistoriaClinica = {
      altura: this.form.value.altura,
      peso: this.form.value.peso,
      temperatura: this.form.value.temperatura,
      presion: this.form.value.presion,
      fecha: fecha.toLocaleDateString('es-AR'),
      turnoId: this.data.turno.id,
      pacienteId: this.data.turno.solicitanteId,
      timestamp: fecha.getTime()
    };

    // Campos dinámicos
    const camposDinamicos = [
      { key: this.keyDinamico1, value: this.valueDinamico1 },
      { key: this.keyDinamico2, value: this.valueDinamico2 },
      { key: this.keyDinamico3, value: this.valueDinamico3 },
    ];

    camposDinamicos.forEach(({ key, value }) => {
      if (key?.trim() && value?.toString().trim()) 
      {
        historia[key.trim()] = value;
      }
    });

    console.log('Historia clínica final:', historia);

    try 
    {
      const result = await this.historiaClinicaService.cargarHistoriaClinica(historia);

      if (result) 
      {
        this.toast.success('Historia clínica cargada con éxito');
        this.dialogRef.close(false);
      } 
      else 
      {
        this.toast.danger('Error al guardar la historia clínica');
      }
    } 
    catch (error) 
    {
      this.toast.danger('Error inesperado al guardar la historia');
      console.error(error);
    }
    finally
    {
      this.isLoading = false;
    }

  }




  Cancelar() 
  {
    this.dialogRef.close(false);
  }



  get altura() 
  {
    return this.form.get('altura');
  }

  get peso() 
  {
    return this.form.get('peso');
  }

  get temperatura() 
  {
    return this.form.get('temperatura');
  }

  get presion() 
  {
    return this.form.get('presion');
  }

}
