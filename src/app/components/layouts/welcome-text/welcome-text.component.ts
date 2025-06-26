import { Component } from '@angular/core';
import { fadeIn } from '../../../animations/fade-in';


@Component({
    selector: 'app-welcome-text',
    imports: [],
    templateUrl: './welcome-text.component.html',
    styleUrl: './welcome-text.component.css',
    animations: [fadeIn]
    
})
export class WelcomeTextComponent {

}
