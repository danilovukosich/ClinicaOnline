import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarDisponibilidadComponent } from './eliminar-disponibilidad.component';

describe('EliminarDisponibilidadComponent', () => {
  let component: EliminarDisponibilidadComponent;
  let fixture: ComponentFixture<EliminarDisponibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarDisponibilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarDisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
