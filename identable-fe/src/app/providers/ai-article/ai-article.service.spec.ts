import { TestBed } from '@angular/core/testing';

import { AiArticleService } from './ai-article.service';

describe('AiArticleService', () => {
  let service: AiArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
