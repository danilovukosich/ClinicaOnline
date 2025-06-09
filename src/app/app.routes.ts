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


export const routes: Routes = [

    {path: "", redirectTo:"landing", pathMatch:'full' },
    {path:'landing', component:LandingComponent },
    {path:'login', component:LoginComponent },
    {path:'registroPaciente', component:RegisterPacienteComponent},
    {path:'registroEspecialista', component:RegisterEspecialistaComponent},
    {path:'home', component:HomeComponent, canActivate: [authGuard],
        children:[
            {path:'welcomeText', component:WelcomeTextComponent},
            {path:'misTurnos', component:MisTurnosComponent},
            {path:'miPerfil', component:MiPerfilComponent},
            {path:'usuarios', component:UsuariosComponent}
        ]
    },




    

    {path: "**", redirectTo:"landing", pathMatch:'full'},
];
