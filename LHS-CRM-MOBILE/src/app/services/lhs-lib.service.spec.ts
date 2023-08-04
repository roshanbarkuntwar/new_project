import { TestBed } from '@angular/core/testing';

import { LhsLibService } from './lhs-lib.service';

describe('LhsLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LhsLibService = TestBed.get(LhsLibService);
    expect(service).toBeTruthy();
  });
});
