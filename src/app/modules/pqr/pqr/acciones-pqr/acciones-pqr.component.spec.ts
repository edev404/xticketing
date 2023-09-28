import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionesPqrComponent } from './acciones-pqr.component';

describe('AccionesPqrsComponent', () => {
  let component: AccionesPqrComponent;
  let fixture: ComponentFixture<AccionesPqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccionesPqrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionesPqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
