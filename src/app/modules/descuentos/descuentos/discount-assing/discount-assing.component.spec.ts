import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountAssingComponent } from './discount-assing.component';

describe('DiscountAssingComponent', () => {
  let component: DiscountAssingComponent;
  let fixture: ComponentFixture<DiscountAssingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountAssingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountAssingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
