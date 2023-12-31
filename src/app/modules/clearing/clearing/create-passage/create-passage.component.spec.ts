import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePassageComponent } from './create-passage.component';

describe('CreateRechargeComponent', () => {
  let component: CreatePassageComponent;
  let fixture: ComponentFixture<CreatePassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePassageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
