import { Component, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  ChartConfiguration,
  ChartType,
  Chart, 
  registerables
} from 'chart.js';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import { TurnosService } from '../../services/turnos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { take } from 'rxjs';
import { DescargarExelService } from '../../services/descargar-exel.service';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgToastService } from 'ng-angular-popup';


Chart.register(...registerables);

@Component({
  selector: 'app-informes-admin',
  standalone: true,
  imports: [CommonModule, 
            MatIconModule, 
            MatButtonModule, 
            MatSelectModule,
            FormsModule, 
            ReactiveFormsModule,
            MatFormFieldModule, 
            MatDatepickerModule,
            MatNativeDateModule ],
  templateUrl: './informes-admin.component.html',
  styleUrl: './informes-admin.component.css'
})
export class InformesAdminComponent {


  
  public chartPie: Chart | undefined;
  public barChart: Chart | undefined;

  public especialistasOptions!:any;

  form1!:FormGroup;
  form2!:FormGroup;
  

  constructor(private turnosService:TurnosService,
              private userService:UsuariosService,
              private excel:DescargarExelService,
              private toast:NgToastService,
  ){}


  ngOnInit() 
  {

    this.userService.GetUsuarios('especialista').subscribe((usuarios:any[])=>{
            this.especialistasOptions = usuarios;
            console.log('ESPECIALISTAS:', this.especialistasOptions);
        });

    
    
    this.turnosService.getTodosTurnosConHistoria().subscribe((turnos:any[])=>{

        const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);
        console.log(turnosOrdenados);
        
        const conteoPorDia = [0, 0, 0, 0, 0, 0];
        const conteoPorEspecialidad: { [nombre: string]: number } = {};

        for (let turno of turnosOrdenados) 
        {
          const dia = Number(turno.diaDeSemana);
          if (dia >= 1 && dia <= 6) 
          {
            conteoPorDia[dia - 1] += 1; 
          }
          
          const nombreEspecialidad = turno.especialidadId?.name || 'Sin especialidad';
          conteoPorEspecialidad[nombreEspecialidad] = (conteoPorEspecialidad[nombreEspecialidad] || 0) + 1;
        }

         
        const ctx = document.getElementById('chartPie') as HTMLCanvasElement;
        if (ctx) 
        {
          if (this.chartPie) 
          {
            this.chartPie.destroy(); 
          }

          this.chartPie = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                datasets: [{
                    data: conteoPorDia,
                  }]
              },
              
          });
        }


        const labelsEspecialidades = Object.keys(conteoPorEspecialidad);
        const valoresEspecialidades = Object.values(conteoPorEspecialidad);

        console.log('oli',labelsEspecialidades,valoresEspecialidades);
        

        const ctx2 = document.getElementById('barChart') as HTMLCanvasElement;
        if (ctx2) 
        {
          if (this.barChart) 
          {
            this.barChart.destroy(); 
          }

          this.barChart = new Chart(ctx2, {
              type: 'bar',
              data: {
                labels: labelsEspecialidades,
                datasets: [{
                    label:'Cantidad de turnos',
                    barThickness: 50,
                    data: valoresEspecialidades,
                    borderRadius: 5,
                    backgroundColor: 'rgba(53, 112, 221, 0.7)',
                    borderWidth: 1,
                    borderColor: 'rgb(53, 112, 221)'
                  }]
              },
          });
        }

    });



    this.form1 = new FormGroup({

      especialista1 : new FormControl('', [Validators.required]),
      start: new FormControl(<Date | null>(null), Validators.required),
      end: new FormControl(<Date | null>(null), Validators.required),
    });

    this.form2 = new FormGroup({

      especialista2 : new FormControl('', [Validators.required]),
      start: new FormControl(<Date | null>(null), Validators.required),
      end: new FormControl(<Date | null>(null), Validators.required),
    });

  }



  exportarGraficosPdf(id:string, titulo:string, nombreArchivo:string) 
  {

    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
  
    const logo = new Image();
    logo.src = 'assets/logo_clinica.png';
  
    logo.onload = () => {
      const logoWidth = 60; 
      const logoHeight = 60; 
      const xPos = (width - logoWidth) / 2;  
      const yPos = 10;   
  
      doc.text(`Fecha de emision: ${new Date().toLocaleDateString('es-AR')}`, 130, 10);
      doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

      const title = 'Clinica Online';
      doc.setFontSize(25);
      const titleWidth = doc.getTextWidth(title); 
      const titleXPos = (width - titleWidth) / 2; 
      const titleYPos = yPos + logoHeight + 10;  
      doc.text(title, titleXPos, titleYPos);
  
      
      doc.setFontSize(20);
      doc.text(titulo, 10, titleYPos + 22);
  
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) 
      {
        const chartImage = canvas.toDataURL('image/png');
        const chartXPos = 40; 
        const chartYPos = titleYPos + 30; 
        const chartWidth = width - 70;
        const chartHeight = (chartWidth * canvas.height) / canvas.width; 
  
       
        doc.addImage(chartImage, 'PNG', chartXPos, chartYPos, chartWidth, chartHeight);
      }
  
     
      doc.save(`${nombreArchivo}.pdf`);
    };
  }



  decargarlogs()
  {
    this.userService.getLogs().then((logs: any[]) => {
    

      console.log('Todos los logs recibidos:', logs);
      const data = logs.map(log => {
        const fechaFirestore = log.fecha;
        const fecha = fechaFirestore?.toDate?.() ?? new Date(fechaFirestore);
        const fechaFormateada = fecha.toLocaleDateString('es-AR');
        const horaFormateada = fecha.toLocaleTimeString('es-AR');

          return {
            mail: log.userMail || '',
            fecha: fechaFormateada,
            horario: horaFormateada,
          };
      }); 
      
      this.excel.descargarLogs(data, 'logs_sistema');
      
    });
  }

  decargarTurnosSolicitados()
  {

    console.log(this.form1.value);

    if(this.form1.valid)
    {
      const start = new Date(this.form1.value.start);
      const end = new Date(this.form1.value.end);

      // Asegurar que incluimos todo el día del "end"
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const startMs = start.getTime();
      const endMs = end.getTime();
      
      this.turnosService.getTurnosEspecialista(this.form1.value.especialista1.id).pipe(take(1)).subscribe((turnos: any[]) => {
      
         const turnosFiltrados = turnos.filter(turno => {
          let fechaTurno: Date;

          // Convertir correctamente desde Timestamp
          if (turno.fechaDatetime?.toDate) {
            fechaTurno = turno.fechaDatetime.toDate();
          } else {
            fechaTurno = new Date(turno.fechaDatetime);
          }

          const turnoMs = fechaTurno.getTime();

          return turnoMs >= startMs && turnoMs <= endMs;
        });

        console.log('FILTRADOS:', turnosFiltrados);

        if(turnosFiltrados.length > 0)
        {
          this.excel.descargarTunrnosInformes(turnosFiltrados, `Turnos_solicitados_${this.form1.value.especialista1.nombre}_${this.form1.value.especialista1.apellido}`);
          this.toast.success('¡Descargado turnos!');
        }
        else
        {
          this.toast.info('¡No se encontraron turnos!');
        }

        

      });
    }
    
  }

  decargarTurnosFinalizados()
  {

    console.log(this.form2.value);

    if(this.form2.valid)
    {
      const start = new Date(this.form2.value.start);
      const end = new Date(this.form2.value.end);

      // Asegurar que incluimos todo el día del "end"
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const startMs = start.getTime();
      const endMs = end.getTime();
      
      this.turnosService.getTurnosFinalizadosEspecialista(this.form2.value.especialista2.id).pipe(take(1)).subscribe((turnos: any[]) => {
      
         const turnosFiltrados = turnos.filter(turno => {
          let fechaTurno: Date;

          // Convertir correctamente desde Timestamp
          if (turno.fechaDatetime?.toDate) {
            fechaTurno = turno.fechaDatetime.toDate();
          } else {
            fechaTurno = new Date(turno.fechaDatetime);
          }

          const turnoMs = fechaTurno.getTime();

          return turnoMs >= startMs && turnoMs <= endMs;
        });

        console.log('FILTRADOS finalizados:', turnosFiltrados);

        if(turnosFiltrados.length > 0)
        {
          this.excel.descargarTunrnosInformes(turnosFiltrados, `Turnos_finalizados_${this.form2.value.especialista2.nombre}_${this.form2.value.especialista2.apellido}`);
          this.toast.success('¡Descargado turnos!');
        }
        else
        {
          this.toast.info('¡No se encontraron turnos!');
        }

        

      });
    }
    
  }

  get especialista1()
  {
    return this.form1.get('especialista1');
  }

  get especialista2()
  {
    return this.form1.get('especialista2');
  }
  

}
