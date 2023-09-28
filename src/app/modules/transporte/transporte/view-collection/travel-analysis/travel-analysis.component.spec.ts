import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAnalysisComponent } from './travel-analysis.component';

describe('TravelAnalysisComponent', () => {
  let component: TravelAnalysisComponent;
  let fixture: ComponentFixture<TravelAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
