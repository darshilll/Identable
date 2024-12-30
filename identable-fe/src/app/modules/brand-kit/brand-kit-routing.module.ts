import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Component
import { AddNewBrandKitComponent } from './add-new-brand-kit/add-new-brand-kit.component';

const routes: Routes = [
  {
    path: '',
    component: AddNewBrandKitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandKitRoutingModule { }
