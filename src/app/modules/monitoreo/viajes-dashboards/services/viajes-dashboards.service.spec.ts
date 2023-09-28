import { TestBed } from '@angular/core/testing';

import { ViajesDashboardsService } from './viajes-dashboards.service';

describe('ViajesDashboardsService', () => {
  let service: ViajesDashboardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViajesDashboardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
