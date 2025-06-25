export interface Turno {
    id?: string;
    fecha: string;
    hora: string;
    diaDeSemana: number;
    especialidadId: any;
    especialistaNombre:string
    especialistaId: string;
    solicitanteId: string;
    solicitanteNombre: string;
    timestamp:number;
    estado:string;
    comentario?:string;
    //resenia?:string;
}
