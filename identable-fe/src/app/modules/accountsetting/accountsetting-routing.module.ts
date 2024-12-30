import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import {AccountSettingComponent} from './account-setting/account-setting.component'

const routes: Routes = [  {
  path: '',
  component:AccountSettingComponent,
  // canActivate: [AuthGuard],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsettingRoutingModule { }
