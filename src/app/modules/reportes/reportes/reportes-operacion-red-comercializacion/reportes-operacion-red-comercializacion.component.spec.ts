import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOperacionRedComercializacionComponent } from './reportes-operacion-red-comercializacion.component';

describe('ReportesOperacionRedComercializacionComponent', () => {
  let component: ReportesOperacionRedComercializacionComponent;
  let fixture: ComponentFixture<ReportesOperacionRedComercializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesOperacionRedComercializacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesOperacionRedComercializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
