import { HistoriaClinica } from './../models/historia-clinica';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Injectable } from '@angular/core';
import autoTable from 'jspdf-autotable'; // Importa el plugin aquí

@Injectable({
  providedIn: 'root'
})
export class DescargarPdfService {

  constructor() { }



   async descargarHistoriaClinica(historia: any, userInfo:any) 
   {

    console.log('HISTORIAS2',historia);
    console.log('USERINFO2',userInfo);

    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const logo = new Image();
    logo.src = "assets/logo_clinica.png";
    
    logo.onload = () => {
   
      const logoWidth = 60; 
      const logoHeight = 60; 
      const xPos = (width - logoWidth) / 2;  
      const yPos = 10;  

      doc.text(`Fecha de emision: ${new Date().toLocaleDateString('es-AR')}`, 130, 10);
      doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

      const title = 'Clinica Online';
      doc.setFontSize(18);
      const titleWidth = doc.getTextWidth(title); 
      const titleXPos = (width - titleWidth) / 2; 
      const titleYPos = yPos + logoHeight + 10;  
      doc.text(title, titleXPos, titleYPos);

      // Datos del paciente
      doc.setFontSize(12);
      doc.text(`Nombre del paciente: ${userInfo.nombre} ${userInfo.apellido}`, 10, titleYPos + 15);
      doc.text(`DNI: ${userInfo.dni}`, 10, titleYPos + 20);
      doc.text(`Edad: ${userInfo.edad}`, 10, titleYPos + 25);
      doc.text(`Obra social: ${userInfo.obraSocial}`, 10, titleYPos + 30);
      // Validar si es paciente
      if (userInfo.rol === 'paciente') 
      {
        doc.setFontSize(16);
        doc.text('Historial clinico del paciente', 10, titleYPos + 45);

        const headers = ['Altura (cm)', 'Peso (kg)', 'Presión', 'Temperatura (°C)', 'Extra'];
        const clavesFijas = ['id', 'altura', 'peso', 'temperatura', 'presion', 'fecha', 'turnoId', 'pacienteId', 'timestamp'];

        const rows = historia.map((historial:HistoriaClinica) => {

          const clavesDinamicas = Object.keys(historial).filter(key => !clavesFijas.includes(key));
          const datosExtras = clavesDinamicas.map(key => `${key}: ${historial[key]}`).join(', ') || 'No tiene';

          return [
            historial.altura || 'No tiene',
            historial.peso || 'No tiene',
            historial.presion || 'No tiene',
            historial.temperatura || 'No tiene',
            datosExtras
          ];

        });

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: titleYPos + 50,
           headStyles: {
            fillColor: [53, 112, 221], // Azul
            textColor: 255,           // Texto blanco
            halign: 'center',         // Centrado horizontal
            valign: 'middle',         // Centrado vertical
            fontStyle: 'bold'
          },
          styles: {
            halign: 'center' // Centra todo el contenido de la tabla
          }
        });

      }

      // Guardar el archivo
      doc.save(`historia_clinica_${userInfo.nombre}${userInfo.apellido}_${new Date().toLocaleDateString('es-AR')}.pdf`);
    };
  }

}
