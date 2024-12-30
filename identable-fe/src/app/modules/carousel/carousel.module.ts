import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// LIBRARY
import { NgxColorsModule } from 'ngx-colors';

// MODULE
import { CarouselRoutingModule } from './carousel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENT
import { CarouselTemplateComponent } from './carousel-template/carousel-template.component';
import { CarouselGeneratorComponent } from './carousel-generator/carousel-generator.component';

@NgModule({
  declarations: [
    CarouselTemplateComponent,
    CarouselGeneratorComponent
  ],
  imports: [
    CommonModule,
    CarouselRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxColorsModule,    
  ]
})
export class CarouselModule { }
