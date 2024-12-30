import { TestBed } from '@angular/core/testing';

import { DesignControlService } from './design-control.service';

describe('DesignControlService', () => {
  let service: DesignControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
