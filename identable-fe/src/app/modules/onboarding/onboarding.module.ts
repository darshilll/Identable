import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { IntegrationComponent } from './integration/integration.component';


@NgModule({
  declarations: [
    PersonalInformationComponent,
    IntegrationComponent
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
