import { Routes } from '@angular/router';
import { LandingComponent } from './components/layouts/landing/landing.component';

export const routes: Routes = [

    {path: "", redirectTo:"landing", pathMatch:'full'},
    {path:'landing', component:LandingComponent},

    

    {path: "**", redirectTo:"home", pathMatch:'full'},
];
