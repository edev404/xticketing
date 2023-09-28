import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeFindingComponent } from './type-finding.component';

describe('TypeFindingComponent', () => {
  let component: TypeFindingComponent;
  let fixture: ComponentFixture<TypeFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeFindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
