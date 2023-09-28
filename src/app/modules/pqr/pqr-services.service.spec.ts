import { TestBed } from '@angular/core/testing';

import { PqrServicesService } from './pqr-services.service';

describe('PqrServicesService', () => {
  let service: PqrServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PqrServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
