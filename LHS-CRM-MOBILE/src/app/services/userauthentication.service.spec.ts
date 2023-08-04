import { TestBed } from '@angular/core/testing';

import { UserauthenticationService } from './userauthentication.service';

describe('UserauthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserauthenticationService = TestBed.get(UserauthenticationService);
    expect(service).toBeTruthy();
  });
});
