import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { InspireMeComponent } from './inspire-me/inspire-me.component';
import { TrendingNewsComponent } from './trending-news/trending-news.component';
import { AiVideoComponent } from './ai-video/ai-video.component';
import { CarouselComponent } from './carousel/carousel.component';
import { OneclickComponent } from './oneclick/oneclick.component';
import { DiyStrategyComponent } from './diy-strategy/diy-strategy.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inspireme',
    pathMatch: 'full',
  },
  {
    path: 'inspireme',
    component: InspireMeComponent,
  },
  {
    path: 'diy',
    component: DiyStrategyComponent,
  },
  {
    path: 'trendingnews',
    component: TrendingNewsComponent,
  },
  {
    path: 'aivideo',
    component: AiVideoComponent,
  },
  {
    path: 'carousel',
    component: CarouselComponent,
  },
  {
    path: 'oneclick',
    component: OneclickComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngageRoutingModule {}
