import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqrRegistroComponent } from './pqr-registro.component';

describe('PqrRegistroComponent', () => {
  let component: PqrRegistroComponent;
  let fixture: ComponentFixture<PqrRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqrRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqrRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
