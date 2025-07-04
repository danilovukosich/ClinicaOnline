import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VerificarMailDialogComponent } from '../layouts/modals/verificar-mail-dialog/verificar-mail-dialog.component';
import { RegisterPacienteComponent } from '../auth/register-paciente/register-paciente.component';
import { MatIcon } from '@angular/material/icon';
import { RegisterEspecialistaComponent } from '../auth/register-especialista/register-especialista.component';
import { RegisterAdministradorComponent } from '../auth/register-administrador/register-administrador.component';
import { VerHistoriaClinicaComponent } from '../layouts/modals/ver-historia-clinica/ver-historia-clinica.component';
import { DescargarExelService } from '../../services/descargar-exel.service';
import { take } from 'rxjs';
import { TurnosService } from '../../services/turnos.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
    selector: 'app-usuarios',
    imports: [MatCardModule, MatButtonModule, MatTabsModule, MatDialogModule, MatIcon],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.css'
})
export class UsuariosComponent 
{

    pacientes!:any;
    especialistas!:any;
    administradores!:any;



    constructor(private usuarios:UsuariosService, 
                private dialog:MatDialog, 
                private userService:UsuariosService,
                private exel:DescargarExelService,
                private turnosService:TurnosService,
                private toast:NgToastService)
    {

    }

    ngOnInit(): void 
    {

        
       
        this.usuarios.GetUsuarios('paciente').subscribe((usuarios:any[])=>{
            this.pacientes = usuarios;
            console.log('PACIENTES:', this.pacientes);
            
        });
        this.usuarios.GetUsuarios('especialista').subscribe((usuarios:any[])=>{
            this.especialistas = usuarios;
            console.log('ESPECIALISTAS:', this.especialistas);
        });
        this.usuarios.GetUsuarios('admin').subscribe((usuarios:any[])=>{
            this.administradores = usuarios;
            console.log('ADMINISTRADORES:', this.administradores);
        });

        
    }


    DarBajaUsuario(id:any)
    {
        this.usuarios.SetEstadoCero(id);
    }

    DarAltaUsuario(id:any)
    {
        this.usuarios.SetEstadoUno(id);
    }

    OpenDialog(rol:string)
    {
        switch(rol)
        {
            case 'paciente':
                this.dialog.open(RegisterPacienteComponent);
            break;

            case 'especialista':
                this.dialog.open(RegisterEspecialistaComponent);
            break;
            
            case 'admin':
                this.dialog.open(RegisterAdministradorComponent);
            break;

        }
    }

    verHistoriaClinica(pacienteId:any, paceinteData:any)
    {
        console.log('Id ????', pacienteId);
        
        this.dialog.open(VerHistoriaClinicaComponent, {
                        data:{
                            pacienteId: pacienteId,
                            pacienteData: paceinteData
                        }
                    });
    }


    descargarInfoUsuarios() 
    {
        this.userService.getAllUsers().then((usuarios: any[]) => {

            const data = usuarios.map(user => ({
                Nombre: user.nombre || '',
                Apellido: user.apellido || '',
                Dni:user.dni || '',
                Edad: user.edad || '',
                Rol: user.rol || '',
                ObraSocial: user.obraSocial || 'No especifica',
                Estado: (user.rol != 'especialista' || user.estado === 1 ? 'Activo' : 'Inactivo')
            }));

            this.exel.descargarUsuarios(data, 'Listado_Usuarios');
        });
    }

    descargarTurnos(paciente:any)
    {
        this.turnosService.getTurnosPacienteConHistoria(paciente.id).pipe(take(1)).subscribe((turnos:any[])=>{

            const turnosOrdenados = turnos.sort((a, b) => b.timestamp - a.timestamp);
            const turnosData = turnosOrdenados;

            console.log('turnos data', turnosData);
            
            if(turnosData.length > 0)
            {
                this.exel.descargarTunrnos(turnosData, `Turnos_paciente_${paciente.nombre}_${paciente.apellido}`, paciente);
            }
            else
            {
                this.toast.info("El paciente todavia no solicito ningun turno","¡No tiene turnos!");
            }
            

        });
    }
    
}




