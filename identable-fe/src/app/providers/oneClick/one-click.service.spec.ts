import { TestBed } from '@angular/core/testing';

import { OneClickService } from './one-click.service';

describe('OneClickService', () => {
  let service: OneClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
