import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingRoutingModule } from './billing-routing.module';
import { CardListComponent } from './card-list/card-list.component';
import { BuyCreditSuccessComponent } from './buy-credit-success/buy-credit-success.component';
import { BuyCreditFaildComponent } from './buy-credit-faild/buy-credit-faild.component';


@NgModule({
  declarations: [
    CardListComponent,
    BuyCreditSuccessComponent,
    BuyCreditFaildComponent
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    SharedModule
  ]
})
export class BillingModule { }
