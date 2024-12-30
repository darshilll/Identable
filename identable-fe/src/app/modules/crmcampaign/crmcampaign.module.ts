import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRMCampaignRoutingModule } from './crmcampaign-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENT
import { CRMComponent } from './crm/crm.component';
import { ProspectingComponent } from './prospecting/prospecting.component';
import { ProfileCrmTabsComponent } from './profile-crm-tabs/profile-crm-tabs.component';

// DIALOG COMPONENT
import { CreateCampaignComponent } from './dialog/create-campaign/create-campaign.component';
import { ProfileCreateCampaignComponent } from './dialog/profile-create-campaign/profile-create-campaign.component';
import { CompanyPageCreateCampaignComponent } from './dialog/company-page-create-campaign/company-page-create-campaign.component';

@NgModule({
  declarations: [
    CRMComponent,
    ProspectingComponent,
    ProfileCrmTabsComponent,
    CreateCampaignComponent,
    ProfileCreateCampaignComponent,
    CompanyPageCreateCampaignComponent
  ],
  imports: [
    CommonModule,
    CRMCampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CRMCampaignModule { }
