import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';

// COMPONENT
import { PricingPlanComponent } from './pricing-plan/pricing-plan.component';
import { UserPlanComponent } from './user-plan/user-plan.component';

@NgModule({
  declarations: [PricingPlanComponent, UserPlanComponent],
  imports: [CommonModule, SubscriptionRoutingModule, MatTooltipModule],
})
export class SubscriptionModule {}
