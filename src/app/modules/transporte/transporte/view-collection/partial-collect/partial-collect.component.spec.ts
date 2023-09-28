import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialCollectComponent } from './partial-collect.component';

describe('PartialCollectComponent', () => {
  let component: PartialCollectComponent;
  let fixture: ComponentFixture<PartialCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartialCollectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
