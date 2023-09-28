import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCollectionComponent } from './register-collection.component';

describe('RegisterCollectionComponent', () => {
  let component: RegisterCollectionComponent;
  let fixture: ComponentFixture<RegisterCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
