import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreateCampaignComponent } from './profile-create-campaign.component';

describe('ProfileCreateCampaignComponent', () => {
  let component: ProfileCreateCampaignComponent;
  let fixture: ComponentFixture<ProfileCreateCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCreateCampaignComponent]
    });
    fixture = TestBed.createComponent(ProfileCreateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
