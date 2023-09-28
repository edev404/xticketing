import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPqrsComponent } from './ver-pqrs.component';

describe('VerPqrsComponent', () => {
  let component: VerPqrsComponent;
  let fixture: ComponentFixture<VerPqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPqrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
