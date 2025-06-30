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
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';


export const routes: Routes = [

    {path: "", redirectTo:"landing", pathMatch:'full' },
    {path:'landing', component:LandingComponent , canActivate: [guestGuard]},
    {path:'login', component:LoginComponent , canActivate: [guestGuard], data: { animation: 'slideDown' }},
    {path:'registroPaciente', component:RegisterPacienteComponent,  data: { animation: 'slideLeft' }},
    {path:'registroEspecialista', component:RegisterEspecialistaComponent, data: { animation: 'slideRight' }},
    {path:'home', component:HomeComponent, canActivate: [authGuard],
        children:[
            {path:'welcomeText', component:WelcomeTextComponent},
            {path:'misTurnos', component:MisTurnosComponent, canActivate: [roleGuard(['paciente', 'especialista'])]},
            {path:'solicitarTurno', component:SolicitarTurnosComponent, canActivate: [roleGuard(['paciente'])]},
            {path:'solicitarTurnoAdmin', component:SolicitarTurnosAdminComponent, canActivate: [roleGuard(['admin'])]},
            {path:'miPerfil', component:MiPerfilComponent, canActivate: [roleGuard(['paciente', 'especialista', 'admin'])]},
            {path:'usuarios', component:UsuariosComponent, canActivate: [roleGuard(['admin'])]},
            {path:'turnos', component:TurnosComponent, canActivate: [roleGuard(['admin'])]},
            {path:'pacientes', component:PacientesComponent, canActivate: [roleGuard(['especialista'])]},
            {path:'informes', component:InformesAdminComponent, canActivate: [roleGuard(['admin'])]}
        ]
    },




    

    {path: "**", redirectTo:"landing", pathMatch:'full'},
];
