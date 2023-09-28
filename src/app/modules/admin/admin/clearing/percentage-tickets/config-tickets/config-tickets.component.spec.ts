import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigTicketsComponent } from './config-tickets.component';

describe('ConfigTicketsComponent', () => {
  let component: ConfigTicketsComponent;
  let fixture: ComponentFixture<ConfigTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
