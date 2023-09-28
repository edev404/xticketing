import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateUpdateComponent } from './rate-update.component';

describe('RateUpdateComponent', () => {
  let component: RateUpdateComponent;
  let fixture: ComponentFixture<RateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
