import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPassengerComponent } from './detail-passenger.component';

describe('DetailPassengerComponent', () => {
  let component: DetailPassengerComponent;
  let fixture: ComponentFixture<DetailPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
