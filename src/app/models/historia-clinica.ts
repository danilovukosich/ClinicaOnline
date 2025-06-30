export interface HistoriaClinica {

    id?: string;
    altura: number;
    peso: number;
    temperatura:number
    presion: string;
    fecha: string;
    turnoId: string | any;
    pacienteId: string;
    timestamp:number;
    [key: string]: any;
}
