import { TestBed } from '@angular/core/testing';

import { ViewCollectionService } from './view-collection.service';

describe('ViewCollectionService', () => {
  let service: ViewCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
