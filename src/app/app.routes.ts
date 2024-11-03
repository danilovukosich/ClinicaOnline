import { Routes } from '@angular/router';
import { LandingComponent } from './components/layouts/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterPacienteComponent } from './components/auth/register-paciente/register-paciente.component';
import { RegisterEspecialistaComponent } from './components/auth/register-especialista/register-especialista.component';

export const routes: Routes = [

    {path: "", redirectTo:"landing", pathMatch:'full'},
    {path:'landing', component:LandingComponent},
    {path:'login', component:LoginComponent},
    {path:'regitroPaciente', component:RegisterPacienteComponent},
    {path:'registroEspecialista', component:RegisterEspecialistaComponent},



    

    {path: "**", redirectTo:"home", pathMatch:'full'},
];
