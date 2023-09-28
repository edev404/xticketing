import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCollectorsCompaniesComponent } from './view-collectors-companies.component';

describe('ViewCollectorsCompaniesComponent', () => {
  let component: ViewCollectorsCompaniesComponent;
  let fixture: ComponentFixture<ViewCollectorsCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCollectorsCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCollectorsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
