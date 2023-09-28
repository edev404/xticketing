import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeActorsComponent } from './type-actors.component';

describe('TypeActorsComponent', () => {
  let component: TypeActorsComponent;
  let fixture: ComponentFixture<TypeActorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeActorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeActorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
