export interface Turno {
    id?: string;
    fecha: string;
    hora: string;
    diaDeSemana: number;
    especialidadId: any;
    especialistaId: string;
    solicitanteId: string;
    timestamp:number;
    estado:string;
    comentario?:string;
    resenia?:string;
}
