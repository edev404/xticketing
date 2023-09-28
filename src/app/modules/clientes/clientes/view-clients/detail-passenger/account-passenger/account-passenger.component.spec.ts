import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPassengerComponent } from './account-passenger.component';

describe('AccountPassengerComponent', () => {
  let component: AccountPassengerComponent;
  let fixture: ComponentFixture<AccountPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
