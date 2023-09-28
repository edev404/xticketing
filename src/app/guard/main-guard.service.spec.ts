import { TestBed } from '@angular/core/testing';

import { MainGuardService } from './main-guard.service';

describe('MainGuardService', () => {
  let service: MainGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
