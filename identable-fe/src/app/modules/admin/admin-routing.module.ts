import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { JobRequestComponent } from './job-request/job-request.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'job-request',
    pathMatch: 'full',
  },
  {
    path: 'job-request',
    component: JobRequestComponent,
  },
  {
    path: 'userlist',
    component: UserListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
