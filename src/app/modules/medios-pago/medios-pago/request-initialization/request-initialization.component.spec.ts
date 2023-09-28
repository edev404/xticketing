import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestInitializationComponent } from './request-initialization.component';

describe('RequestInitializationComponent', () => {
  let component: RequestInitializationComponent;
  let fixture: ComponentFixture<RequestInitializationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestInitializationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInitializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
