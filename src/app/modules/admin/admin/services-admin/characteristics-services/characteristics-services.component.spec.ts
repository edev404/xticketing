import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicsServicesComponent } from './characteristics-services.component';

describe('CharacteristicsServicesComponent', () => {
  let component: CharacteristicsServicesComponent;
  let fixture: ComponentFixture<CharacteristicsServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacteristicsServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
