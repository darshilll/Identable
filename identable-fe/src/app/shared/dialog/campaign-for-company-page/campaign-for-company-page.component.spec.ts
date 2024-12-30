import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignForCompanyPageComponent } from './campaign-for-company-page.component';

describe('CampaignForCompanyPageComponent', () => {
  let component: CampaignForCompanyPageComponent;
  let fixture: ComponentFixture<CampaignForCompanyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignForCompanyPageComponent]
    });
    fixture = TestBed.createComponent(CampaignForCompanyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
