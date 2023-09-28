import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectorCompaniesComponent } from './create-collector-companies.component';

describe('CreateCollectorCompaniesComponent', () => {
  let component: CreateCollectorCompaniesComponent;
  let fixture: ComponentFixture<CreateCollectorCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollectorCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectorCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
