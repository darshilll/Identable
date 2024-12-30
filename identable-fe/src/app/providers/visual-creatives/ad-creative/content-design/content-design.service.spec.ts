import { TestBed } from '@angular/core/testing';

import { ContentDesignService } from './content-design.service';

describe('ContentDesignService', () => {
  let service: ContentDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
