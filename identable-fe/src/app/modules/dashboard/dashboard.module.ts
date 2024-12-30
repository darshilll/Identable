import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Load Module
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { LinkedinDashboardComponent } from './linkedin-dashboard/linkedin-dashboard.component';

@NgModule({
  declarations: [
    LinkedinDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
