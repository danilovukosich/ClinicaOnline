import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatGridListModule,AnimateOnScrollModule, MatButtonModule, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  
})
export class LandingComponent {

}
