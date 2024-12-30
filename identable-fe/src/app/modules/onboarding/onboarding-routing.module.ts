import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { IntegrationComponent } from './integration/integration.component';

const routes: Routes = [
  {
    path:'',
    component:PersonalInformationComponent
  },
  {
    path:'integration',
    component:IntegrationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
