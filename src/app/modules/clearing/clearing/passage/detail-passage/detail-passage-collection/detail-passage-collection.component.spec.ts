import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPassageCollectionComponent } from './detail-passage-collection.component';

describe('DetailPassageCollectionComponent', () => {
  let component: DetailPassageCollectionComponent;
  let fixture: ComponentFixture<DetailPassageCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPassageCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPassageCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
