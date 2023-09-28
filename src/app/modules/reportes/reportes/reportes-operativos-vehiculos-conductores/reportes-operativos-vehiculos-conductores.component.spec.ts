import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesOperativosVehiculosConductoresComponent } from './reportes-operativos-vehiculos-conductores.component';

describe('ReportesOperativosVehiculosConductoresComponent', () => {
  let component: ReportesOperativosVehiculosConductoresComponent;
  let fixture: ComponentFixture<ReportesOperativosVehiculosConductoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesOperativosVehiculosConductoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesOperativosVehiculosConductoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
