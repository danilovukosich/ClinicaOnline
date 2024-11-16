export class UsuarioEspecialista {
    constructor(
        public nombre:string,
        public apellido:string,
        public edad:number,
        public dni:number,
        public especialidades:string[],
        public estado:number,
        public rol:string
    ){}
}
