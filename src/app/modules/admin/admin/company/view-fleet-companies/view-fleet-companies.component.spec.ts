import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFleetCompaniesComponent } from './view-fleet-companies.component';

describe('ViewFleetCompaniesComponent', () => {
  let component: ViewFleetCompaniesComponent;
  let fixture: ComponentFixture<ViewFleetCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFleetCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFleetCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
