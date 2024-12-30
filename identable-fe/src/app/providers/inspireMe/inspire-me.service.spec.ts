import { TestBed } from '@angular/core/testing';

import { InspireMeService } from './inspire-me.service';

describe('InspireMeService', () => {
  let service: InspireMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspireMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
