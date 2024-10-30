import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatGridListModule,AnimateOnScrollModule, MatButtonModule, FooterComponent, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  
})
export class LandingComponent {

  @ViewChild('section2') section2!: ElementRef;
  @ViewChild('sectionDoble') sectionDoble!: ElementRef;
  @ViewChild('section3') section3!: ElementRef;

  constructor(private route: ActivatedRoute){}

  // onScrollToSection(sectionId: string)
  // {
  //   switch (sectionId) 
  //   {
  //     case 'section2':
  //       this.section2.nativeElement.scrollIntoView({ behavior: 'smooth' });
  //       break;
  //     case 'sectionDoble':
  //       this.sectionDoble.nativeElement.scrollIntoView({ behavior: 'smooth' });
  //       break;
  //     case 'section3':
  //       this.section3.nativeElement.scrollIntoView({ behavior: 'smooth' });
  //       break;
  //   }
  // }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.queryParams.subscribe((params) => {
      const sectionId = params['section'];
      if (sectionId) 
      {
        this.onScrollToSection(sectionId);
      }
    });
  }

  onScrollToSection(sectionId: string) {
    let offset = -140; // Ajusta este valor según el espacio que necesites en la parte superior
    
    if (sectionId === 'top') 
      {
      // Scrollea hasta arriba de la página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let element;
    switch (sectionId) 
    {
      case 'section2':
        element = this.section2;
        break;
      case 'sectionDoble':
        this.sectionDoble.nativeElement.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'section3':
        element = this.section3;
        break;
    }
  
    if (element) 
    {
      const yOffset = element.nativeElement.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  }

}
