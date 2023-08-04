import { TestBed } from '@angular/core/testing';

import { LhsLibService } from './lhs-lib.service';

describe('LhsLibService', () => {
  let service: LhsLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LhsLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
