import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngageRoutingModule } from './engage-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ColorSketchModule } from 'ngx-color/sketch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxColorsModule } from 'ngx-colors';

//LIBRARY
import { TagInputModule } from 'ngx-chips';

//COMPONENT
import { InspireMeComponent } from './inspire-me/inspire-me.component';
import { TrendingNewsComponent } from './trending-news/trending-news.component';
import { AiVideoComponent } from './ai-video/ai-video.component';
import { CarouselComponent } from './carousel/carousel.component';
import { OneclickComponent } from './oneclick/oneclick.component';
import { DiyStrategyComponent } from './diy-strategy/diy-strategy.component';

@NgModule({
  declarations: [
    InspireMeComponent,
    TrendingNewsComponent,
    AiVideoComponent,
    CarouselComponent,
    OneclickComponent,
    DiyStrategyComponent
  ],
  imports: [
    CommonModule,
    EngageRoutingModule,
    SharedModule,
    ColorSketchModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    SlickCarouselModule,
    NgxColorsModule,
    TagInputModule
  ]
})
export class EngageModule { }
