import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignSchedulerComponent } from './campaign-scheduler/campaign-scheduler.component';
const routes: Routes = [
  {
    path: '',
    component: CampaignListComponent,
  },
  {
    path: 'createcampaign',
    component: CreateCampaignComponent,
  },
  {
    path: 'campaignscheduler',
    component: CampaignSchedulerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OneClickRoutingModule {}
