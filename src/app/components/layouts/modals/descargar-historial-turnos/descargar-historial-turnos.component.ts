import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgToastService } from 'ng-angular-popup';
import { TurnosService } from '../../../../services/turnos.service';
import { MatSelectModule } from '@angular/material/select';
import { EspecialistaService } from '../../../../services/especialista.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Turno } from '../../../../models/turno';

@Component({
  selector: 'app-descargar-historial-turnos',
  imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule,
            MatButtonModule,
            MatFormFieldModule,
            MatSelectModule
  ],
  templateUrl: './descargar-historial-turnos.component.html',
  styleUrl: './descargar-historial-turnos.component.css'
})
export class DescargarHistorialTurnosComponent {



   form!:FormGroup;
   especialidades!: any;
   turnos!:any;
   descargando:boolean = false;

   constructor(private turno:TurnosService,
              private toast:NgToastService,
              private especialista: EspecialistaService,
              private turnosService:TurnosService,
              @Inject(MAT_DIALOG_DATA) public data: { userId: string},
              private dialogRef: MatDialogRef<DescargarHistorialTurnosComponent>
  ){}


  ngOnInit(): void {
    
    this.form = new FormGroup({
      especialidad : new FormControl('', [Validators.required])
    });

    this.especialidades = this.especialista.GetEspecialidades();
    console.log('data:',this.especialidades, this.data.userId);

    this.turnosService.getTurnosPacienteFinalizados(this.data.userId).subscribe((turnos:any[])=>{
    
        const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);
       
       const especialidadesMap = new Map<string, { key: string; name: string }>();

      turnosOrdenados.forEach((turno: Turno) => {
        const key = turno.especialidadId.key;
        const name = turno.especialidadId.name;

        if (key && !especialidadesMap.has(key)) {
          especialidadesMap.set(key, { key, name });
        }
      });

      this.especialidades = Array.from(especialidadesMap.values());

      console.log('Especialidades únicas:', this.especialidades);

    });
    

    
  }


  Cerrar() 
  {
    this.dialogRef.close(false);
  }

  get especialidad()
  {
    return this.form.get('especialidad');
  }

  
  Descargar() 
  {
    this.form.markAllAsTouched();
    const form= this.form.value;

    if(this.form.valid)
    {
      this.descargando = true;

      this.turnosService.getTurnosPacienteFinalizadosPorEspecialidad(this.data.userId, form.especialidad).subscribe((turnos:any[])=>{

        const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);
        this.turnos = turnosOrdenados;


        console.log("Turnos para des:",this.turnos);
        this.descargando = false;


        //DESCARGAR

        this.dialogRef.close(false);

      });
    }
    
  }

}
