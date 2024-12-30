import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LinkedinDashboardComponent } from './linkedin-dashboard/linkedin-dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:LinkedinDashboardComponent
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
