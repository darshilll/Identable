import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULE
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AiImageRoutingModule } from './ai-image-routing.module';
import { GeneratedImageComponent } from './generated-image/generated-image.component';


@NgModule({
  declarations: [
    GeneratedImageComponent
  ],
  imports: [
    CommonModule,
    AiImageRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AiImageModule { }
