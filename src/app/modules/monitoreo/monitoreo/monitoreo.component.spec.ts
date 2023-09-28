import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoComponents } from './monitoreo.component';

describe('MonitoreoComponents', () => {
  let component: MonitoreoComponents;
  let fixture: ComponentFixture<MonitoreoComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoreoComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
