import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajesDashboardsComponent } from './viajes-dashboards.component';

describe('ViajesDashboardsComponent', () => {
  let component: ViajesDashboardsComponent;
  let fixture: ComponentFixture<ViajesDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViajesDashboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
