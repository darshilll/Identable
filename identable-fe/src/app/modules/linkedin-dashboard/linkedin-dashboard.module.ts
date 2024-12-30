import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { LinkedinDashboardRoutingModule } from './linkedin-dashboard-routing.module';

// COMPONENT
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardOverviewComponent } from './dashboard-tabs/dashboard-overview/dashboard-overview.component';
import { AudienceComponent } from './dashboard-tabs/audience/audience.component';
import { BenchmarkingComponent } from './dashboard-tabs/benchmarking/benchmarking.component';
import { ContentAreaComponent } from './dashboard-tabs/content-area/content-area.component';
import { PostContentPreviewComponent } from './dialog/post-content-preview/post-content-preview.component';
import { TownEngagementComponent } from './dialog/town-engagement/town-engagement.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardOverviewComponent,
    AudienceComponent,
    BenchmarkingComponent,
    ContentAreaComponent,
    PostContentPreviewComponent,
    TownEngagementComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LinkedinDashboardRoutingModule,
    MatTabsModule,
    SharedModule,
    HighchartsChartModule
  ]
})
export class LinkedinDashboardModule { }
