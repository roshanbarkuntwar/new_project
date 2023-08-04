import { TestBed } from '@angular/core/testing';

import { EventScannerService } from './event-scanner.service';

describe('EventScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventScannerService = TestBed.get(EventScannerService);
    expect(service).toBeTruthy();
  });
});
