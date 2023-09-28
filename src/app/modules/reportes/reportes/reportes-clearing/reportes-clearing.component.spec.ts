import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesClearingComponent } from './reportes-clearing.component';

describe('ReportesClearingComponent', () => {
  let component: ReportesClearingComponent;
  let fixture: ComponentFixture<ReportesClearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesClearingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesClearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
