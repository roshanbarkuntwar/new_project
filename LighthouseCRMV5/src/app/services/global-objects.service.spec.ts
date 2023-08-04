import { TestBed } from '@angular/core/testing';

import { GlobalObjectsService } from './global-objects.service';

describe('GlobalObjectsService', () => {
  let service: GlobalObjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalObjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
