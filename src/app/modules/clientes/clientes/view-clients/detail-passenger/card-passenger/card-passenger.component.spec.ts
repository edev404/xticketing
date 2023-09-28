import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPassengerComponent } from './card-passenger.component';

describe('CardPassengerComponent', () => {
  let component: CardPassengerComponent;
  let fixture: ComponentFixture<CardPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
