import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDisponibilidadComponent } from './editar-disponibilidad.component';

describe('EditarDisponibilidadComponent', () => {
  let component: EditarDisponibilidadComponent;
  let fixture: ComponentFixture<EditarDisponibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDisponibilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
