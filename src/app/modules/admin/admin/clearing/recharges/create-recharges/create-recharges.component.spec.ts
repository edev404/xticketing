import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRechargesComponent } from './create-recharges.component';

describe('CreateRechargesComponent', () => {
  let component: CreateRechargesComponent;
  let fixture: ComponentFixture<CreateRechargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRechargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRechargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
