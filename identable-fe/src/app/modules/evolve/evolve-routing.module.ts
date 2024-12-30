import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { SchedulePostCalendarComponent } from './schedule-post-calendar/schedule-post-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulePostCalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvolveRoutingModule { }
