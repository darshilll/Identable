import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// MODULE
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

import { BrandKitRoutingModule } from './brand-kit-routing.module';
import { AddNewBrandKitComponent } from './add-new-brand-kit/add-new-brand-kit.component';
import { EditBrandLogoComponent } from './dialog/edit-brand-logo/edit-brand-logo.component';


@NgModule({
  declarations: [
    AddNewBrandKitComponent,
    EditBrandLogoComponent
  ],
  imports: [
    CommonModule,
    BrandKitRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class BrandKitModule { }
