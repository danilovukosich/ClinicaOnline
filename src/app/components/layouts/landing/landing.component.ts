import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatGridListModule, AnimateOnScrollModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
