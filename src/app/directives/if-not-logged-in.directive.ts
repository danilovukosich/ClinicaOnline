import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appIfNotLoggedIn]',
  standalone: true
})
export class IfNotLoggedInDirective {

   constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.GetUser();

    if (!user) 
    {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } 
    else 
    {
      this.viewContainer.clear();
    }
  }

}
