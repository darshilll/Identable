import { TestBed } from '@angular/core/testing';

import { SampleDashboardService } from './sample-dashboard.service';

describe('SampleDashboardService', () => {
  let service: SampleDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
