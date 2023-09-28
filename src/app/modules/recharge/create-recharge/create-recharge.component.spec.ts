import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRechargeComponent } from './create-recharge.component';

describe('CreateRechargeComponent', () => {
  let component: CreateRechargeComponent;
  let fixture: ComponentFixture<CreateRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
