import { TestBed } from '@angular/core/testing';

import { TrendingNewsService } from './trending-news.service';

describe('TrendingNewsService', () => {
  let service: TrendingNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrendingNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
