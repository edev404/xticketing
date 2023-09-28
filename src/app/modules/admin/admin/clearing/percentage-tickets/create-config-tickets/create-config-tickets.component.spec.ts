import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConfigTicketsComponent } from './create-config-tickets.component';

describe('CreateConfigTicketsComponent', () => {
  let component: CreateConfigTicketsComponent;
  let fixture: ComponentFixture<CreateConfigTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateConfigTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConfigTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
