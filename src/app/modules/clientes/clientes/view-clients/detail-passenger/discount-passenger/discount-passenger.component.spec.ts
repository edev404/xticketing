import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountPassengerComponent } from './discount-passenger.component';

describe('DiscountPassengerComponent', () => {
  let component: DiscountPassengerComponent;
  let fixture: ComponentFixture<DiscountPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
