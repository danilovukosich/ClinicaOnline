import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { authState } from 'rxfire/auth';
import { NgToastService } from 'ng-angular-popup';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    const toast = inject(NgToastService);

    return authState(auth).pipe(
      map((user) => {
        const role = user?.displayName;
        if (role && allowedRoles.includes(role)) 
        {
          return true;
        } 
        else 
        {
          toast.danger("","¡No tiene el rol necesario!", 4000)
          router.navigate(['/home/welcomeText']);
          return false;
        }
      })
    );
  };
}
