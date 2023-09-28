import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingRechargeComponent } from './finding-recharge.component';

describe('FindingRechargeComponent', () => {
  let component: FindingRechargeComponent;
  let fixture: ComponentFixture<FindingRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
