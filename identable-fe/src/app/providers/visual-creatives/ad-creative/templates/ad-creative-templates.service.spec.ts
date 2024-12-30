import { TestBed } from '@angular/core/testing';

import { AdCreativeTemplatesService } from './ad-creative-templates.service';

describe('AdCreativeTemplatesService', () => {
  let service: AdCreativeTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdCreativeTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
