import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { CarouselTemplateComponent } from './carousel-template/carousel-template.component';
import { CarouselGeneratorComponent } from './carousel-generator/carousel-generator.component';

const routes: Routes = [
  {
    path: '',
    component: CarouselTemplateComponent,
  },
  { 
    path: 'carousels-genrator',
    component: CarouselGeneratorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarouselRoutingModule { }
