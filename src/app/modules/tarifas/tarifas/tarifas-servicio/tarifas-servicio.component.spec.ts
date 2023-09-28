import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasServicioComponent } from './tarifas-servicio.component';

describe('TarifasServicioComponent', () => {
  let component: TarifasServicioComponent;
  let fixture: ComponentFixture<TarifasServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarifasServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifasServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
