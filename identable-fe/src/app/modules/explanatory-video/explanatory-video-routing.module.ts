import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { GeneratedVidoesComponent } from './generated-vidoes/generated-vidoes.component';
import { CreateVideoComponent } from './create-video/create-video.component';
import { ViewGeneratedVideoComponent } from './view-generated-video/view-generated-video.component';

const routes: Routes = [
  {
    path: '',
    component: GeneratedVidoesComponent,
  },
  {
    path: 'create',
    component: CreateVideoComponent,
  },
  {
    path: 'view',
    component: ViewGeneratedVideoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplanatoryVideoRoutingModule { }
