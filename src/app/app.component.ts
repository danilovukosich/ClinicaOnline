import { Component, ViewChild } from '@angular/core';
import { ChildrenOutletContexts, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layouts/navbar/navbar.component';
import { LandingComponent } from './components/layouts/landing/landing.component';
import { NgToastModule } from 'ng-angular-popup';
import { slideInAnimation } from './animations/left-right';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, NgToastModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    animations: [slideInAnimation]
})
export class AppComponent {
  title = 'clinicaonline';

  // @ViewChild(LandingComponent) landingComponent!: LandingComponent;

  constructor(private router: Router, private contexts: ChildrenOutletContexts){}

  
  onScrollToSection(sectionId: string) {
    this.router.navigate(['/landing'], { queryParams: { section: sectionId } });
  }


  prepareRoute(outlet: RouterOutlet) 
  {
    return outlet?.activatedRouteData?.['animation'];
  }

  getRouteAnimationData() {
 
      const animationData = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
      // console.log('Animation Data:', animationData);
      return animationData;
  }

}
