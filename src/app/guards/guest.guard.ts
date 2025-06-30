// src/app/guards/guest.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class guestGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      map(user => {
        if (user) 
        {
          
          return this.router.createUrlTree(['/home/welcomeText']);
        } 
        else 
        {
          return true;
        }
      })
    );
  }
}
