import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';
import { UserPlanComponent } from './user-plan/user-plan.component';

const routes: Routes = [
  {
    path: '',
    component: UserPlanComponent,
  },
  {
    path: 'plan',
    component: PricingPlanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
