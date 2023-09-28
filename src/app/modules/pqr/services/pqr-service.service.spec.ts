import { TestBed } from '@angular/core/testing';

import { PqrServiceService } from './pqr-service.service';

describe('PqrServiceService', () => {
  let service: PqrServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PqrServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
