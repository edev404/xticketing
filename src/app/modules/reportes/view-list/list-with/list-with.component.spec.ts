import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWithComponent } from './list-with.component';

describe('ListWithComponent', () => {
  let component: ListWithComponent;
  let fixture: ComponentFixture<ListWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWithComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
