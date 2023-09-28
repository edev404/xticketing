import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersReportsComponent } from './transfers-reports.component';

describe('TransfersReportsComponent', () => {
  let component: TransfersReportsComponent;
  let fixture: ComponentFixture<TransfersReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
