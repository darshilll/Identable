import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { CardListComponent } from './card-list/card-list.component';
import { BuyCreditFaildComponent } from './buy-credit-faild/buy-credit-faild.component';
import { BuyCreditSuccessComponent } from './buy-credit-success/buy-credit-success.component';

const routes: Routes = [
  {
    path: '',
    component: CardListComponent,
  },
  {
    path: 'buycreditsuccess',
    component: BuyCreditSuccessComponent,
  },
  {
    path: 'buycreditfaild',
    component: BuyCreditFaildComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
