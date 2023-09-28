import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPqrComponent } from './reportes-pqr.component';

describe('ReportesPqrComponent', () => {
  let component: ReportesPqrComponent;
  let fixture: ComponentFixture<ReportesPqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesPqrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
