import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActorsComponent } from './create-actors.component';

describe('CreateActorsComponent', () => {
  let component: CreateActorsComponent;
  let fixture: ComponentFixture<CreateActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateActorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
