import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Component
import { CreativeOptionsComponent } from './creative-options/creative-options.component';
import { CarouselMakerComponent } from './carousel/carousel-maker/carousel-maker.component';
import { MakeAdCreativeComponent } from './ad-creative/make-ad-creative/make-ad-creative.component';

const routes: Routes = [
  {
    path: '',
    component: CreativeOptionsComponent,
  },
  {
    path: 'carousel',
    component: CarouselMakerComponent,
  },
  {
    path: 'carousel/:id',
    component: CarouselMakerComponent,
  },
  {
    path: 'adcreative',
    component: MakeAdCreativeComponent,
  },
  {
    path: 'adcreative/:id',
    component: MakeAdCreativeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualCreativesRoutingModule {}
