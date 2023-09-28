import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEntitesComponent } from './create-entites.component';

describe('CreateEntitesComponent', () => {
  let component: CreateEntitesComponent;
  let fixture: ComponentFixture<CreateEntitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEntitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEntitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
