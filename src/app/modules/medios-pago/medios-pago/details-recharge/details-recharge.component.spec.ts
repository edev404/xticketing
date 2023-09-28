import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRechargeComponent } from './details-recharge.component';

describe('DetailsRechargeComponent', () => {
  let component: DetailsRechargeComponent;
  let fixture: ComponentFixture<DetailsRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
