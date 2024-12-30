import { TestBed } from '@angular/core/testing';

import { BrandKitService } from './brand-kit.service';

describe('BrandKitService', () => {
  let service: BrandKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
