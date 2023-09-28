import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPassageDistributionsComponent } from './detail-passage-distributions.component';

describe('DetailPassageDistributionsComponent', () => {
  let component: DetailPassageDistributionsComponent;
  let fixture: ComponentFixture<DetailPassageDistributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPassageDistributionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPassageDistributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
