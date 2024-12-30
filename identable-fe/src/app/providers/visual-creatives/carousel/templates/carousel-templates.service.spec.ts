import { TestBed } from '@angular/core/testing';

import { CarouselTemplatesService } from './carousel-templates.service';

describe('CarouselTemplatesService', () => {
  let service: CarouselTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
