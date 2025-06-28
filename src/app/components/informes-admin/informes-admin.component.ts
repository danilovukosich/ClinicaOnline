import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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


Chart.register(...registerables);

@Component({
  selector: 'app-informes-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './informes-admin.component.html',
  styleUrl: './informes-admin.component.css'
})
export class InformesAdminComponent {


  
  public chartPie: Chart | undefined;
  public barChart: Chart | undefined;
  

  constructor(private turnosService:TurnosService){}


  ngOnInit() 
  {
    
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
                    data: valoresEspecialidades,
                  }]
              },
          });
        }

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

  

}
