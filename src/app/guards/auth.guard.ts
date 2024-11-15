import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const toast = inject(NgToastService);
  const router = inject(Router);


  if(auth.GetUser())
  {
    return true
  }

  toast.danger("","Debe estar logueado!", 3000)
  router.navigate(['login']);
  return false;
};
