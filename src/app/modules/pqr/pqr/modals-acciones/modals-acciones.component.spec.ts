import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsAccionesComponent } from './modals-acciones.component';

describe('ModalsAccionesComponent', () => {
  let component: ModalsAccionesComponent;
  let fixture: ComponentFixture<ModalsAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalsAccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalsAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
