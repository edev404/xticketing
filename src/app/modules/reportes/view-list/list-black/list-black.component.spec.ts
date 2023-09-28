import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBlackComponent } from './list-black.component';

describe('ListBlackComponent', () => {
  let component: ListBlackComponent;
  let fixture: ComponentFixture<ListBlackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBlackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBlackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
