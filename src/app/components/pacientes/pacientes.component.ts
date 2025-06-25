import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { UsuariosService } from '../../services/usuarios.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { Turno } from '../../models/turno';

@Component({
  selector: 'app-pacientes',
  imports: [MatCardModule, MatButtonModule, MatTabsModule, MatDialogModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {

  pacientes!:any;
  turnos!:any[];
  idPacientes!:string[];
  userId!:any;

  constructor(private turnosService:TurnosService, private auth:AuthService, private usuarios:UsuariosService, private dialog:MatDialog)
  {
    
  }

  async ngOnInit() 
  {

    this.userId = await this.auth.GetUserId();

    this.turnosService.getTurnosEspecialista(this.userId).subscribe((turnos:any[])=>{
        this.turnos = turnos;
            
        console.log('TURNOS',this.turnos);
        
        this.getTurnosId();

        if (this.idPacientes.length > 0) 
        {
          this.usuarios.GetPacientesDeEspecialista(this.idPacientes).subscribe((usuarios:any[])=>{
            console.log('HOLA');
            
              this.pacientes = usuarios;
    
              console.log('PACIENTES:', this.pacientes);
              
          });
        } 

    });

  }

  async getTurnosId()
  {
    this.idPacientes=[];

    this.turnos.forEach(turno => {
      const idPaciente = turno.solicitanteId;

      if (idPaciente && !this.idPacientes.includes(idPaciente)) 
      {
        this.idPacientes.push(idPaciente);
      }

    });

    console.log('IDs únicos de pacientes:', this.idPacientes);

  }


}
