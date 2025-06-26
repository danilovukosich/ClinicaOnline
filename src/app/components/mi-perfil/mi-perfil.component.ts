import { Observable, Subject, timeout } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Auth, User } from '@angular/fire/auth';
import { Disponibilidad } from '../../models/disponibilidad';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CrearDisponibilidadComponent } from '../layouts/modals/crear-disponibilidad/crear-disponibilidad.component';
import { EditarDisponibilidadComponent } from '../layouts/modals/editar-disponibilidad/editar-disponibilidad.component';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../models/historia-clinica';
import { DescargarPdfService } from '../../services/descargar-pdf.service';
import { NgToastService } from 'ng-angular-popup';


export interface DisponibilidadPorDia {
  dia: string;
  especialidad?: string;
  desde?: string;
  hasta?: string;
  frecuencia?: number;
}


@Component({
    selector: 'app-mi-perfil',
    imports: [CommonModule, 
        MatIcon, 
        MatProgressSpinnerModule, 
        MatTableModule,
        MatButtonModule,
        MatIcon,
        MatTooltipModule,
        MatDialogModule],
    templateUrl: './mi-perfil.component.html',
    styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

    
  cargando:boolean=false;

  user:any;
  userInfo$!: Observable<any>;
  userData!:any;
  imagen2!:string;
  fondoDePortada: string = 'https://cdn.wallpapersafari.com/30/78/5j8kxe.jpg';
  rol!:any;
  especialidades!:[];

  displayedColumns: string[] = ['dia', 'especialidad', 'horarioDesde', 'horarioHasta', 'frecuencia', 'acciones'];
  dataSource: Disponibilidad[] = [];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  historiasClinicas: HistoriaClinica[] = [];
  columnasHistorias: string[] = ['fecha', 'altura', 'peso', 'temperatura', 'presion', 'datoExtra'];

  constructor(private authService: AuthService, 
              private auth: Auth,
              private disponibilidadService: DisponibilidadService,
              private dialog:MatDialog,
              private historiaClinicaService:HistoriaClinicaService,
              private pdf:DescargarPdfService,
              private toast:NgToastService)
  {
    
  }
  
  async ngOnInit() {
    
    
    this.cargando=true;
    this.user = await this.authService.GetUserAsync();
    this.userInfo$ = this.authService.GetUserInfo();
    this.rol = this.authService.GetRole();
    

    this.userInfo$.subscribe({
        next: (userInfo) => {
          console.log('Datos del usuario recibidos:', userInfo);
          this.imagen2 = userInfo.imagen2;
          this.especialidades=userInfo.especialidades;
          this.cargando = false; 
          this.userData = userInfo;
          console.log('(datos cargados)');
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
          this.cargando = false;
          console.log('(error)');
        }
    });

    if(this.rol == 'especialista')
    {
      console.log('ROL:', this.rol);
      this.auth.onAuthStateChanged(user => {
      if (user) 
      {
        this.cargarDisponibilidades()
      }
      });
    }

    if (this.rol === 'paciente') 
    {
      console.log('hola', this.user.uid);
      
      this.historiaClinicaService.getHistoriaClinicaPaciente(this.user.uid).subscribe((historial: HistoriaClinica[]) => {
        this.historiasClinicas = historial;
        console.log('Historias clínicas del paciente:', historial);
      });
    }

      

  }

  obtenerCamposDinamicos(historia: any): string[] 
  {
    const clavesFijas = ['id', 'altura', 'peso', 'temperatura', 'presion', 'fecha', 'turnoId', 'pacienteId', 'timestamp'];
    return Object.keys(historia).filter(key => !clavesFijas.includes(key));
  }

  cargarDisponibilidades() 
  {
    if(this.user) 
    {
      this.disponibilidadService.getDisponibilidadesPorEspecialista(this.user.uid)
      .subscribe((data: Disponibilidad[]) => {
        this.dataSource = this.diasSemana.map(dia => {
        const encontrado = data.find(d => d.dia === dia);
        return encontrado || {
          dia,
          especialistaId: this.user.uid,
          especialidad: '---',
          horarioDesde: '---',
          horarioHasta: '---',
          frecuencia: 0
        };
        });
        console.log('DISPO(subcribe):',this.dataSource);
      });
        
    }
  }

  editar(disponibilidad: Disponibilidad, dia: string, especialistaId:string) {
    // abrir modal o similar
    console.log(this.especialidades);
    
    this.dialog.open(EditarDisponibilidadComponent, {
      data: {
        disponibilidad: disponibilidad,
        dia: dia,
        especialistaId: especialistaId,
        especialidades: this.especialidades
      }
    });
  }

  crear(dia: string, especialistaId:string) 
  { 
    this.dialog.open(CrearDisponibilidadComponent, {
      data: {
        dia: dia,
        especialistaId: especialistaId,
        especialidades: this.especialidades
      }
    });
  }

  async descargarHistoriaClinica() 
  {
    if(this.historiasClinicas.length > 0)
    { 
      await this.pdf.descargarHistoriaClinica(this.historiasClinicas, this.userData);
      this.toast.success("¡Comenzo la descarga!")
    }
    else
    {
      this.toast.danger("¡No posee hitorial clinico!")
    }
    
  }

    
    


}
