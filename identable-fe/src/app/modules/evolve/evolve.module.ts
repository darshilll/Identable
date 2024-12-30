import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { EvolveRoutingModule } from './evolve-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SchedulePostCalendarComponent } from './schedule-post-calendar/schedule-post-calendar.component';

@NgModule({
  declarations: [SchedulePostCalendarComponent],
  imports: [CommonModule, EvolveRoutingModule, SharedModule, MatTooltipModule],
})
export class EvolveModule {}
