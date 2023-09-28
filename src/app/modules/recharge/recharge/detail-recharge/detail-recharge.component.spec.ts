import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRechargeComponent } from './detail-recharge.component';

describe('DetailRechargeComponent', () => {
  let component: DetailRechargeComponent;
  let fixture: ComponentFixture<DetailRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
