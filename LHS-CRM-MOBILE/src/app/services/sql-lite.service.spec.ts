import { TestBed } from '@angular/core/testing';

import { SqlLiteService } from './sql-lite.service';

describe('SqlLiteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqlLiteService = TestBed.get(SqlLiteService);
    expect(service).toBeTruthy();
  });
});
