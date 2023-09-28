import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGrayComponent } from './list-gray.component';

describe('ListGrayComponent', () => {
  let component: ListGrayComponent;
  let fixture: ComponentFixture<ListGrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
