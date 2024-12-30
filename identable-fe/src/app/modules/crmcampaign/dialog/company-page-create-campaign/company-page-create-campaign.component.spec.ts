import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPageCreateCampaignComponent } from './company-page-create-campaign.component';

describe('CompanyPageCreateCampaignComponent', () => {
  let component: CompanyPageCreateCampaignComponent;
  let fixture: ComponentFixture<CompanyPageCreateCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPageCreateCampaignComponent]
    });
    fixture = TestBed.createComponent(CompanyPageCreateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
