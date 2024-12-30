import { TestBed } from '@angular/core/testing';

import { CrmCampaignService } from './crm-campaign.service';

describe('CrmCampaignService', () => {
  let service: CrmCampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrmCampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
