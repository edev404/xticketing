import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageTicketsComponent } from './percentage-tickets.component';

describe('PercentageTicketsComponent', () => {
  let component: PercentageTicketsComponent;
  let fixture: ComponentFixture<PercentageTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
