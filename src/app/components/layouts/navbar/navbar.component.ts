import { Component, EventEmitter, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, MenuModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  @Output() scrollToEvent = new EventEmitter<string>();

  items: MenuItem[] | undefined;

  constructor(private auth:AuthService){}
  ngOnInit() 
  {
      this.items = [
          { label: 'New', icon: 'pi pi-plus' },
          { label: 'Search', icon: 'pi pi-search' }
      ];
  }
 


  scrollToSection(sectionId: string) 
  {
    this.scrollToEvent.emit(sectionId);
  }

  scrollToTop()
  {
    this.scrollToEvent.emit('top');
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
