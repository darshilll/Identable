import { TestBed } from '@angular/core/testing';

import { AdCreativeService } from './ad-creative.service';

describe('AdCreativeService', () => {
  let service: AdCreativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdCreativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
