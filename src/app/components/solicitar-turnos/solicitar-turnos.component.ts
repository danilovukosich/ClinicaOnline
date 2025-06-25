import { AuthService } from './../../services/auth.service';
import { Component,  inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { EspecialistaService } from '../../services/especialista.service';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { DiasDeSemanaPipe } from '../../pipes/cast/dias-de-semana.pipe';
import { ConfirmarTurnoComponent } from '../layouts/modals/confirmar-turno/confirmar-turno.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { TurnosService } from '../../services/turnos.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-solicitar-turnos',
  imports: [MatButtonModule,
            MatStepperModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            CommonModule,
            MatCardModule,
            MatIcon,
            DiasDeSemanaPipe,
            MatDialogModule,
            MatProgressSpinnerModule],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.css'
})
export class SolicitarTurnosComponent {

  constructor(private especialista:EspecialistaService,
              private usuarios:UsuariosService,
              private disponibilidadService:DisponibilidadService,
              private dialog:MatDialog,
              private auth:Auth,
              private authService:AuthService,
              private turnosService:TurnosService
  ){}

  cargando:boolean=false;

  especialidades:any[]=[];
  selectedEspecialidad: any = null;

  especialistas:any[]=[];
  selectedEspecialista: any =null;

  disponibilidad: any[] = [];
  turnosGenerados: any[] = [];
  turnosOcupados: string[] = [];
  turnoSeleccionado: any = null;

  // turnosPorDia: { [numero: number]: any[] } = {};
  // nombresDias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

 
  private _formBuilder = inject(FormBuilder);


  firstFormGroup = this._formBuilder.group({
    especialidad: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    especialista: ['', Validators.required],
  });
  isLinear = false;


  userInfo$!: Observable<any>;
  nombreSolicitante!:string;


  async ngOnInit() 
  {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cargando=true;
    this.especialista.GetEspecialidades().subscribe(epecialidades=>{
      this.especialidades=epecialidades;
      console.log(this.especialidades);
    });

     this.userInfo$ = this.authService.GetUserInfo();

    this.userInfo$.subscribe({
        next: (userInfo) => {
          console.log('Datos del usuario recibidos:', userInfo);
          this.nombreSolicitante=userInfo.nombre + " " + userInfo.apellido;
          console.log('(datos cargados)');
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
          this.cargando = false;
          console.log('(error)');
        }
    });

    this.userInfo$ = await this.authService.GetUserInfo();
    
    
  }

  seleccionarEspecialidad(especialidad: any) 
  {
    this.selectedEspecialidad = especialidad;
    this.firstFormGroup.get('especialidad')?.setValue(especialidad.key);
    console.log(this.selectedEspecialidad);

    this.usuarios.GetEspecialistas(this.selectedEspecialidad).subscribe((usuarios:any[])=>{
            this.especialistas = usuarios;
            console.log('ESPECIALISTAS:', this.especialistas);
        });

    
  }

  isSeleccionada(especialidad: any): boolean 
  {
    return this.selectedEspecialidad?.key === especialidad.key;
  }

  onNextStep(stepper: MatStepper) 
  {
    if (this.firstFormGroup.invalid) 
    {
      this.firstFormGroup.markAllAsTouched();
      return;
    }

    stepper.next();
  }

  seleccionarEspecialista(especialista: any) 
  {
    console.log('HOLAA');
    
    this.selectedEspecialista = especialista;
    this.secondFormGroup.get('especialista')?.setValue(especialista.id);
    console.log('ESPECIALISTA:',especialista);
    
  }

  isSeleccionadoEspecialista(especialista: any): boolean 
  {
    return this.selectedEspecialista === especialista;
  }

  async onNextStep2(stepper: MatStepper) 
  {
    if (this.secondFormGroup.invalid) 
    {
      this.secondFormGroup.markAllAsTouched();
      return;
    }

    //cargar turnos seleccionados  

    await this.cargarDisponibilidades();

    console.log('Disponibilidad especialista:' + this.selectedEspecialista);
    console.log('Disponibilidad:' + this.disponibilidad);
    
    stepper.next();
  }

  cargarDisponibilidades() 
  {
    let snapshot;
    this.traerTurnosOcupados();
    this.disponibilidadService.getDisponibilidadesPorEspecialista(this.selectedEspecialista.id).subscribe((dispo:any[])=>{
      
      snapshot = dispo;
      console.log('hola1155', snapshot);
      this.disponibilidad = snapshot.filter((d: any) => d.especialidad === this.selectedEspecialidad.key);

      this.generarTurnosDesdeDisponibilidad();
      
      
      console.log('disponibilidad dps de snapshot',this.disponibilidad);
    });
    
  }

  generarTurnosDesdeDisponibilidad() 
  {
    const hoy = new Date();
    const diasAdelante = 15;

    this.turnosGenerados = [];

    for (let i = 0; i <= diasAdelante; i++) 
    {
      const fechaActual = new Date(hoy);
      fechaActual.setDate(hoy.getDate() + i);

      const diaSemana = fechaActual.toLocaleDateString('es-AR', { weekday: 'long' });
      const dia = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      const dispo = this.disponibilidad.find(d => d.dia === dia);
      if (!dispo) continue;

      const desde = this.parseHora(dispo.horarioDesde, fechaActual);
      const hasta = this.parseHora(dispo.horarioHasta, fechaActual);
      const frecuencia = Number(dispo.frecuencia); // minutos

      let actual = new Date(desde);
      while (actual < hasta) 
      {
        this.turnosGenerados.push({
          //fecha: new Date(actual),
          hora: actual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fecha: actual.toLocaleDateString('es-AR'),
          diaDeSemana: actual.getDay(),
          especialidadId: this.selectedEspecialidad,
          especialistaId:this.selectedEspecialista.id,
          especialistaNombre:this.selectedEspecialista.nombre + " " + this.selectedEspecialista.apellido,
          solicitanteId: this.auth.currentUser?.uid,
          solicitanteNombre: this.nombreSolicitante ,
          estado:'pendiente',
          timestamp: actual.getTime(), // clave única útil
        });

        actual = new Date(actual.getTime() + frecuencia * 60 * 1000);
      }
    }

    console.log('Turnos generados:', this.turnosGenerados);
  }

  parseHora(hora: string, fechaBase: Date): Date 
  {
    const [h, m] = hora.split(':').map(Number);
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setHours(h, m, 0, 0);
    return nuevaFecha;
  }

  

  seleccionarTurno(turno: any) 
  {
    this.turnoSeleccionado = turno;

    console.log(this.turnoSeleccionado);
    this.dialog.open(ConfirmarTurnoComponent, {
      data: {
        turno: turno
      }
    });
    
  }

  async traerTurnosOcupados()
  {
    this.turnosService
    .getTurnosSeleccionados(this.selectedEspecialista.id, this.selectedEspecialidad)
    .subscribe((turnos: any[]) => {
      this.turnosOcupados = turnos.map(t => t.timestamp);
      console.log('Turnos ocupados:', this.turnosOcupados);
    });
  }

  
}
