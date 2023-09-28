import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesRedValidacionComponent } from './reportes-red-validacion.component';

describe('ReportesRedValidacionComponent', () => {
  let component: ReportesRedValidacionComponent;
  let fixture: ComponentFixture<ReportesRedValidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesRedValidacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesRedValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
