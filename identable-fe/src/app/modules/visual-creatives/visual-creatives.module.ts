import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualCreativesRoutingModule } from './visual-creatives-routing.module';

// LIBRARY
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MediumEditorDirective } from './editor-directive/medium-editor.directive'; // Import directive

// MODULE
import { SharedModule } from 'src/app/shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';

// NAVIGATION COMPONENT
import { TopHeaderComponent } from './navigation/top-header/top-header.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';

//COMPONENT
import { CreativeOptionsComponent } from './creative-options/creative-options.component';
import { CarouselMakerComponent } from './carousel/carousel-maker/carousel-maker.component';
import { SetBackgroundImageComponent } from './dialog/set-background-image/set-background-image.component';
import { ColorSettingComponent } from './components/color-setting/color-setting.component';
import { DesignControlComponent } from './components/design-control/design-control.component';
import { LayersControlComponent } from './components/layers-control/layers-control.component';
import { ProfileShotsComponent } from './components/profile-shots/profile-shots.component';
import { SlideControlComponent } from './components/slide-control/slide-control.component';
import { TextSettingComponent } from './components/text-setting/text-setting.component';
import { CarouselTemplatesComponent } from './dialog/carousel-templates/carousel-templates.component';
import { AdCreativeTemplatesComponent } from './dialog/ad-creative-templates/ad-creative-templates.component';
import { AdCreativeDesignLayoutComponent } from './components/ad-creative-design-layout/ad-creative-design-layout.component';
import { CarouselDownloadPreviewComponent } from './dialog/carousel-download-preview/carousel-download-preview.component';
import { ChoiceCarouselTemplatesComponent } from './components/choice-carousel-templates/choice-carousel-templates.component';

// Custom Directive
import { MakeAdCreativeComponent } from './ad-creative/make-ad-creative/make-ad-creative.component';
import { ChoiceAdCreativeTemplatesComponent } from './components/choice-ad-creative-templates/choice-ad-creative-templates.component';
import { CreativeImageEditorComponent } from './components/creative-image-editor/creative-image-editor.component';

@NgModule({
  declarations: [
    CreativeOptionsComponent,
    TopHeaderComponent,
    SidebarComponent,
    CarouselMakerComponent,
    SetBackgroundImageComponent,
    ColorSettingComponent,
    DesignControlComponent,
    LayersControlComponent,
    ProfileShotsComponent,
    SlideControlComponent,
    TextSettingComponent,
    CarouselTemplatesComponent,
    AdCreativeTemplatesComponent,
    MakeAdCreativeComponent,
    MediumEditorDirective,
    AdCreativeDesignLayoutComponent,
    CarouselDownloadPreviewComponent,
    ChoiceCarouselTemplatesComponent,
    ChoiceAdCreativeTemplatesComponent,
    CreativeImageEditorComponent
  ],
  imports: [
    CommonModule,
    VisualCreativesRoutingModule,
    SharedModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    DragDropModule,
  ]
})
export class VisualCreativesModule { }
