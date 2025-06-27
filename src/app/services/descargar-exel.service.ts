import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class DescargarExelService 
{

  constructor() { }


  async descargarAtenciones(turnos: any[], nombreArchivo: string, especialidad:string) 
  {
    if (!turnos || turnos.length === 0) 
    {
      console.warn('No hay datos para exportar.');
      return;
    }

    // Mapeo de turnos
    const turnosTransformados = turnos.map((turno: Turno) => ({
      'Especialista': turno.especialistaNombre || 'N/A',
      'Especialidad': turno.especialidadId?.name || 'N/A',
      'Fecha': turno.fecha,
      'Horario': turno.hora,
      'Estado': turno.estado || 'N/A',
      'Comentario': turno.comentario || '', 
    }));

    // Agregar una fila vacía al principio para desplazar los datos
    const hojaDatos: any[][] = [['Atenciones especialidad '+ especialidad], 
      ...XLSX.utils.sheet_to_json(
        XLSX.utils.json_to_sheet(turnosTransformados), 
        { header: 1 }
      ) as any[][]];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(hojaDatos);

    // Autosize columnas
    const colWidths = hojaDatos[1].map((_, colIndex) => {
      const maxLength = hojaDatos.reduce((max, row) => {
        const cell = row[colIndex];
        const cellLength = cell ? cell.toString().length : 0;
        return Math.max(max, cellLength);
      }, 10); // mínimo ancho 10
      return { wch: maxLength + 2 }; // +2 por padding
    });

    worksheet['!cols'] = colWidths;

    // Combinar celdas de A1 a E1
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } } // de fila 0 col 0 (A1) a fila 0 col 4 (E1)
    ];

    // Centrar el texto de A1
    worksheet['A1'].s = {
      alignment: { horizontal: 'center' },
      font: { bold: true }
    };

    // Crear libro
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Turnos': worksheet },
      SheetNames: ['Turnos']
    };

    // Estilo: activar estilos con bookType: 'xlsx'
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fecha = new Date().toISOString().slice(0, 10);
    FileSaver.saveAs(data, `${nombreArchivo}_${fecha}.xlsx`);
  }




  async descargarUsuarios(usuarios: any[], nombreArchivo: string) 
  {
    if (!usuarios || usuarios.length === 0) 
    {
      console.warn('No hay datos para exportar.');
      return;
    }


    // Agregar una fila vacía al principio para desplazar los datos
    const hojaDatos: any[][] = [['Listado de usuarios'], 
      ...XLSX.utils.sheet_to_json(
        XLSX.utils.json_to_sheet(usuarios), 
        { header: 1 }
      ) as any[][]];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(hojaDatos);

    // Autosize columnas
    const colWidths = hojaDatos[1].map((_, colIndex) => {
      const maxLength = hojaDatos.reduce((max, row) => {
        const cell = row[colIndex];
        const cellLength = cell ? cell.toString().length : 0;
        return Math.max(max, cellLength);
      }, 10); // mínimo ancho 10
      return { wch: maxLength + 2 }; // +2 por padding
    });

    worksheet['!cols'] = colWidths;

    // Combinar celdas de A1 a E1
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } } // de fila 0 col 0 (A1) a fila 0 col 4 (E1)
    ];

    // Centrar el texto de A1
    worksheet['A1'].s = {
      alignment: { horizontal: 'center' },
      font: { bold: true }
    };

    // Crear libro
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Turnos': worksheet },
      SheetNames: ['Turnos']
    };

    // Estilo: activar estilos con bookType: 'xlsx'
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fecha = new Date().toISOString().slice(0, 10);
    FileSaver.saveAs(data, `${nombreArchivo}_${fecha}.xlsx`);
  }


  async descargarTunrnos(turnos: any[], nombreArchivo: string, paciente:any) 
  {
    if (!turnos || turnos.length === 0) 
    {
      console.warn('No hay datos para exportar.');
      return;
    }

    // Mapeo de turnos
    const turnosTransformados = turnos.map((turno: Turno) => ({
      'Especialista': turno.especialistaNombre || 'N/A',
      'Especialidad': turno.especialidadId?.name || 'N/A',
      'Fecha': turno.fecha,
      'Horario': turno.hora,
      'Estado': turno.estado || 'N/A',
      'Comentario': turno.comentario || '', 
    }));

    // Agregar una fila vacía al principio para desplazar los datos
    const hojaDatos: any[][] = [[`Turnos_paciente_${paciente.nombre}_${paciente.apellido}.xlsx`], 
      ...XLSX.utils.sheet_to_json(
        XLSX.utils.json_to_sheet(turnosTransformados), 
        { header: 1 }
      ) as any[][]];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(hojaDatos);

    // Autosize columnas
    const colWidths = hojaDatos[1].map((_, colIndex) => {
      const maxLength = hojaDatos.reduce((max, row) => {
        const cell = row[colIndex];
        const cellLength = cell ? cell.toString().length : 0;
        return Math.max(max, cellLength);
      }, 10); // mínimo ancho 10
      return { wch: maxLength + 2 }; // +2 por padding
    });

    worksheet['!cols'] = colWidths;

    // Combinar celdas de A1 a E1
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } } // de fila 0 col 0 (A1) a fila 0 col 4 (E1)
    ];

    // Centrar el texto de A1
    worksheet['A1'].s = {
      alignment: { horizontal: 'center' },
      font: { bold: true }
    };

    // Crear libro
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Turnos': worksheet },
      SheetNames: ['Turnos']
    };

    // Estilo: activar estilos con bookType: 'xlsx'
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fecha = new Date().toISOString().slice(0, 10);
    FileSaver.saveAs(data, `${nombreArchivo}_${fecha}.xlsx`);
  }
}
