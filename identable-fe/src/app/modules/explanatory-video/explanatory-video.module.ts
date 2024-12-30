import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplanatoryVideoRoutingModule } from './explanatory-video-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

//LIBRARY
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONETS
import { GeneratedVidoesComponent } from './generated-vidoes/generated-vidoes.component';
import { CreateVideoComponent } from './create-video/create-video.component';
import { GeneratingVideoProcessingComponent } from './dialog/generating-video-processing/generating-video-processing.component';
import { ViewGeneratedVideoComponent } from './view-generated-video/view-generated-video.component';

@NgModule({
  declarations: [
    GeneratedVidoesComponent,
    CreateVideoComponent,
    GeneratingVideoProcessingComponent,
    ViewGeneratedVideoComponent
  ],
  imports: [
    CommonModule,
    ExplanatoryVideoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExplanatoryVideoModule { }
