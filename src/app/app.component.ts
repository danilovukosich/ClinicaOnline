import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { LandingComponent } from './components/layouts/landing/landing.component';
import { NgToastModule } from 'ng-angular-popup';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, NgToastModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clinicaonline';

  // @ViewChild(LandingComponent) landingComponent!: LandingComponent;

  constructor(private router: Router){}

  
  onScrollToSection(sectionId: string) {
    this.router.navigate(['/landing'], { queryParams: { section: sectionId } });
  }

}
