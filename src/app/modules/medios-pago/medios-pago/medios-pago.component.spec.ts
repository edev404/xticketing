import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediosPagoComponent } from './medios-pago.component';

describe('MediosPagoComponent', () => {
  let component: MediosPagoComponent;
  let fixture: ComponentFixture<MediosPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediosPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
