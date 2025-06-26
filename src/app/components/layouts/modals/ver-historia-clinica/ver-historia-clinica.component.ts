import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../../../../models/historia-clinica';
import { AuthService } from '../../../../services/auth.service';
import { HistoriaClinicaService } from '../../../../services/historia-clinica.service';
import { DescargarPdfService } from '../../../../services/descargar-pdf.service';
import { NgToastService } from 'ng-angular-popup';
import { MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ver-historia-clinica',
  imports: [CommonModule,
            MatTableModule,
            MatIcon,
            MatIconModule,
            MatButtonModule
  ],
  templateUrl: './ver-historia-clinica.component.html',
  styleUrl: './ver-historia-clinica.component.css'
})
export class VerHistoriaClinicaComponent {

  cargando:boolean=false;
 

  historiasClinicas: HistoriaClinica[] = [];
  columnasHistorias: string[] = ['fecha', 'altura', 'peso', 'temperatura', 'presion', 'datoExtra'];

  
  
  constructor( @Inject(MAT_DIALOG_DATA) public data: { pacienteId: any; pacienteData:any},
              private dialogRef: MatDialogRef<VerHistoriaClinicaComponent>,
              private authService: AuthService,
              private historiaClinicaService:HistoriaClinicaService,
              private pdf:DescargarPdfService,
              private toast:NgToastService){}


  async ngOnInit() 
  {
    this.cargando=true;

    console.log('USUARIO Historia: ', this.data.pacienteId);
    

    this.historiaClinicaService.getHistoriaClinicaPaciente(this.data.pacienteId).subscribe((historial: HistoriaClinica[]) => {
        this.historiasClinicas = historial;
        console.log('Historias clínicas del paciente:', historial);
      });

  }


  Cerrar() 
  {
    this.dialogRef.close(false);
  }

  obtenerCamposDinamicos(historia: any): string[] 
  {
    const clavesFijas = ['id', 'altura', 'peso', 'temperatura', 'presion', 'fecha', 'turnoId', 'pacienteId', 'timestamp'];
    return Object.keys(historia).filter(key => !clavesFijas.includes(key));
  }

    async descargarHistoriaClinica() 
  {
    if(this.historiasClinicas.length > 0)
    { 
      await this.pdf.descargarHistoriaClinica(this.historiasClinicas, this.data.pacienteData);
      this.toast.success("¡Comenzo la descarga!")
    }
    else
    {
      this.toast.danger("¡No posee hitorial clinico!")
    }
    
  }

}
