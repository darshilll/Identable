import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TokenInterceptor } from 'src/app/token.interceptor';
import { AccountsettingRoutingModule } from './accountsetting-routing.module';
//MODULE
import { SharedModule } from '../../shared/shared.module';

//LIBRARY
import { MatTooltipModule } from '@angular/material/tooltip';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//COMPONENT
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { BillingComponent } from './billing/billing.component';
import { GeneralComponent } from './general/general.component';
import { IntegrationComponent } from './integration/integration.component';
import { AiSettingComponent } from './ai-setting/ai-setting.component';

@NgModule({
  declarations: [
    AccountSettingComponent,
    BillingComponent,
    GeneralComponent,
    IntegrationComponent,
    AiSettingComponent,
  ],
  imports: [
    CommonModule,
    AccountsettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TagInputModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountsettingModule {}
