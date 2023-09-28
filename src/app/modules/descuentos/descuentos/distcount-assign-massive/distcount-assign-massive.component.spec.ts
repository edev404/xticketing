import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistcountAssignMassiveComponent } from './distcount-assign-massive.component';

describe('DistcountAssignMassiveComponent', () => {
  let component: DistcountAssignMassiveComponent;
  let fixture: ComponentFixture<DistcountAssignMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistcountAssignMassiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistcountAssignMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
