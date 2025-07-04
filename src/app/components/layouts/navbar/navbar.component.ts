import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IfLoggedInDirective } from '../../../directives/if-logged-in.directive';
import { IfGuestDirective } from '../../../directives/if-guest.directive';

@Component({
    selector: 'app-navbar',
    imports: [MatToolbarModule, 
              MatButtonModule, 
              MatIconModule, 
              RouterLink,
              IfLoggedInDirective,
              IfGuestDirective],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  @Output() scrollToEvent = new EventEmitter<string>();


  constructor(private auth:AuthService, private router: Router){}
  ngOnInit() 
  {
      
  }
 


  scrollToSection(sectionId: string) 
  {
    this.scrollToEvent.emit(sectionId);
  }

  scrollToTop()
  {
    if(this.VerifyCurrentUser())
    {
      this.router.navigate(['home/welcomeText']);
    }
    else
    {
      this.scrollToEvent.emit('top');
    }

  }


  VerifyCurrentUser()
  {
    if(this.auth.GetUser()!=null)
    {
      return true;
    }
    else
    {
      return false;
    }

  }

  LogOut()
  {
    this.auth.LogOut();
  }

}
