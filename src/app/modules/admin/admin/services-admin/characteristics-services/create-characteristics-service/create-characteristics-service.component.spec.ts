import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacteristicsServiceComponent } from './create-characteristics-service.component';

describe('CreateCharacteristicsServiceComponent', () => {
  let component: CreateCharacteristicsServiceComponent;
  let fixture: ComponentFixture<CreateCharacteristicsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCharacteristicsServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCharacteristicsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
