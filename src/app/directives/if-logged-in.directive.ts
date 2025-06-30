import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';

@Directive({
  selector: '[appIfLoggedIn]',
  standalone: true,
})
export class IfLoggedInDirective {
  private auth = inject(Auth);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  constructor() {
    effect(() => {
      authState(this.auth).subscribe(user => {
        this.viewContainer.clear();
        if (user) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
    });
  }
}
