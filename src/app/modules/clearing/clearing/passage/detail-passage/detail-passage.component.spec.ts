import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPassageComponent } from './detail-passage.component';

describe('DetailPassageComponent', () => {
  let component: DetailPassageComponent;
  let fixture: ComponentFixture<DetailPassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPassageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
