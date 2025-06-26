import { Routes } from '@angular/router';
import { LandingComponent } from './components/layouts/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterPacienteComponent } from './components/auth/register-paciente/register-paciente.component';
import { RegisterEspecialistaComponent } from './components/auth/register-especialista/register-especialista.component';
import { HomeComponent } from './components/layouts/home/home.component';
import { WelcomeTextComponent } from './components/layouts/welcome-text/welcome-text.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { authGuard } from './guards/auth.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { SolicitarTurnosComponent } from './components/solicitar-turnos/solicitar-turnos.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { SolicitarTurnosAdminComponent } from './components/solicitar-turnos-admin/solicitar-turnos-admin.component';
import { InformesAdminComponent } from './components/informes-admin/informes-admin.component';


export const routes: Routes = [

    {path: "", redirectTo:"landing", pathMatch:'full' },
    {path:'landing', component:LandingComponent },
    {path:'login', component:LoginComponent , data: { animation: 'slideDown' }},
    {path:'registroPaciente', component:RegisterPacienteComponent,  data: { animation: 'slideLeft' }},
    {path:'registroEspecialista', component:RegisterEspecialistaComponent, data: { animation: 'slideRight' }},
    {path:'home', component:HomeComponent,/* canActivate: [authGuard],*/
        children:[
            {path:'welcomeText', component:WelcomeTextComponent},
            {path:'misTurnos', component:MisTurnosComponent},
            {path:'solicitarTurno', component:SolicitarTurnosComponent},
            {path:'solicitarTurnoAdmin', component:SolicitarTurnosAdminComponent},
            {path:'miPerfil', component:MiPerfilComponent},
            {path:'usuarios', component:UsuariosComponent},
            {path:'turnos', component:TurnosComponent},
            {path:'pacientes', component:PacientesComponent},
            {path:'informes', component:InformesAdminComponent}
        ]
    },




    

    {path: "**", redirectTo:"landing", pathMatch:'full'},
];
