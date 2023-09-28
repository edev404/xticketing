import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPqrComponent } from './lista-pqr.component';

describe('ListaPqrComponent', () => {
  let component: ListaPqrComponent;
  let fixture: ComponentFixture<ListaPqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPqrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
