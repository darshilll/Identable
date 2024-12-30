import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { GeneratedImageComponent } from './generated-image/generated-image.component';

const routes: Routes = [
  {
    path: '',
    component: GeneratedImageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiImageRoutingModule { }
