import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appIfLoggedIn]',
  standalone: true
})
export class IfLoggedInDirective {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private authService: AuthService) { }


  ngOnInit() 
  {
    const user = this.authService.GetUser();

    if (user) 
    {
      this.viewContainer.createEmbeddedView(this.templateRef); // Mostrar contenido
    } 
    else 
    {
      this.viewContainer.clear(); // Ocultar contenido
    }
  }
}
