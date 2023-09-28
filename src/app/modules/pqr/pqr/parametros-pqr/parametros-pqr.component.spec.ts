import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosPqrComponent } from './parametros-pqr.component';

describe('ParametrosPqrComponent', () => {
  let component: ParametrosPqrComponent;
  let fixture: ComponentFixture<ParametrosPqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosPqrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosPqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
