import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCollectionComponent } from './reports-collection.component';

describe('ReportsCollectionComponent', () => {
  let component: ReportsCollectionComponent;
  let fixture: ComponentFixture<ReportsCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
