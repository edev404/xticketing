import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTypesCompaniesComponent } from './view-types-companies.component';

describe('ViewTypesCompaniesComponent', () => {
  let component: ViewTypesCompaniesComponent;
  let fixture: ComponentFixture<ViewTypesCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTypesCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTypesCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
