import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { CalendarModule } from 'primeng/calendar';

import { OneClickRoutingModule } from './one-click-routing.module';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CampaignSchedulerComponent } from './campaign-scheduler/campaign-scheduler.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { PostPreviewDialogComponent } from './post-preview-dialog/post-preview-dialog.component';
import { PostEditDialogComponent } from './post-edit-dialog/post-edit-dialog.component';
import { DateDialogComponent } from './date-dialog/date-dialog.component';
import { TimeDialogComponent } from './time-dialog/time-dialog.component';

@NgModule({
  declarations: [
    CreateCampaignComponent,
    CampaignSchedulerComponent,
    CampaignListComponent,
    PostPreviewDialogComponent,
    PostEditDialogComponent,
    DateDialogComponent,
    TimeDialogComponent,
  ],
  imports: [
    CommonModule,
    OneClickRoutingModule,
    NgxColorsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TagInputModule,
    CalendarModule
  ],
})
export class OneClickModule {}
