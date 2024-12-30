import { TestBed } from '@angular/core/testing';

import { AiVideoService } from './ai-video.service';

describe('AiVideoService', () => {
  let service: AiVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
