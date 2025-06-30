import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appIfRole]',
  standalone: true
})
export class IfRoleDirective {

   @Input('appIfRole') allowedRoles: string[] = [];

   constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.GetUser();
    const userRole = user?.displayName?.toLowerCase(); // Ajustalo si guardás el rol en otro lado

    if (userRole && this.allowedRoles.includes(userRole)) 
    {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } 
    else 
    {
      this.viewContainer.clear();
    }
  }

}
