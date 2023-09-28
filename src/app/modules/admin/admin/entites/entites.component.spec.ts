import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitesComponent } from './entites.component';

describe('EntitesComponent', () => {
  let component: EntitesComponent;
  let fixture: ComponentFixture<EntitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
