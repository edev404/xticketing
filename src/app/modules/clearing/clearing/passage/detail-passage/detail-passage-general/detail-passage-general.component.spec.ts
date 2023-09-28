import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPassageGeneralComponent } from './detail-passage-general.component';

describe('DetailPassageGeneralComponent', () => {
  let component: DetailPassageGeneralComponent;
  let fixture: ComponentFixture<DetailPassageGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPassageGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPassageGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
