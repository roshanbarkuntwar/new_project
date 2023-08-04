import { TestBed } from '@angular/core/testing';

import { PouchDBService } from './pouch-db.service';

describe('PouchDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PouchDBService = TestBed.get(PouchDBService);
    expect(service).toBeTruthy();
  });
});
