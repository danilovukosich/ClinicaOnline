import { Component,  inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { EspecialistaService } from '../../services/especialista.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-solicitar-turnos',
  imports: [MatButtonModule,
            MatStepperModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            CommonModule],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.css'
})
export class SolicitarTurnosComponent {

  constructor(private especialista:EspecialistaService){}

  especialidades:any[]=[];
  selectedEspecialidad: any = null;
 
  private _formBuilder = inject(FormBuilder);


  firstFormGroup = this._formBuilder.group({
    especialidad: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.especialista.GetEspecialidades().subscribe(epecialidades=>{
      this.especialidades=epecialidades;
      console.log(this.especialidades);
      
    });
    
    
  }
  seleccionarEspecialidad(especialidad: any) 
  {
    this.selectedEspecialidad = especialidad;
    this.firstFormGroup.get('especialidad')?.setValue(especialidad.key);
    console.log(this.selectedEspecialidad);
    
  }

  isSeleccionada(especialidad: any): boolean 
  {
    return this.selectedEspecialidad?.key === especialidad.key;
  }

  onNextStep(stepper: MatStepper) {
  if (this.firstFormGroup.invalid) {
    this.firstFormGroup.markAllAsTouched();
    return;
  }

  stepper.next();
}

 
}
