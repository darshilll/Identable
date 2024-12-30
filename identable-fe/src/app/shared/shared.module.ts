import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Load Library and Services
import { GlobalMatModule } from '../global-mat/global-mat.module';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ColorSketchModule } from 'ngx-color/sketch';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedRoutingModule } from './shared-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxColorsModule } from 'ngx-colors';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SwiperModule } from 'swiper/angular';

// Load Component
import { PaginationComponent } from './common/pagination/pagination.component';
import { LoaderComponent } from './common/loader/loader.component';
import { EditLinkedinPostComponent } from './dialog/edit-linkedin-post/edit-linkedin-post.component';
import { PostScheduleDialogComponent } from './dialog/post-schedule-dialog/post-schedule-dialog.component';
import { PlanUpgradeDialogComponent } from './dialog/plan-upgrade-dialog/plan-upgrade-dialog.component';
import { GenerateCommonPromptComponent } from './dialog/generate-common-prompt/generate-common-prompt.component';
import { GiphyListComponent } from './components/giphy-list/giphy-list.component';
import { PixelImageVideoComponent } from './components/pixel-image-video/pixel-image-video.component';
import { SwitchProfileComponent } from './dialog/switch-profile/switch-profile.component';
import { AiSettingComponent } from './dialog/ai-setting/ai-setting.component';
import { ConfirmPostScheduledComponent } from './dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { AddCustomCarouselThemeComponent } from './dialog/add-custom-carousel-theme/add-custom-carousel-theme.component';
import { SaveThemeComponent } from './dialog/save-theme/save-theme.component';
import { PlayIntroVideoComponent } from './components/play-intro-video/play-intro-video.component';
import { SinglePostDetailsComponent } from './dialog/single-post-details/single-post-details.component';
import { OneClickGenerationComponent } from './dialog/one-click-generation/one-click-generation.component';
import { ProgressivePopupComponent } from './components/progressive-popup/progressive-popup.component';
import { GeneratedAivideoListComponent } from './dialog/generated-aivideo-list/generated-aivideo-list.component';
import { OnboardIntegrationIntroComponent } from './dialog/onboard-integration-intro/onboard-integration-intro.component';
import { ViewCarouselSlideComponent } from './dialog/view-carousel-slide/view-carousel-slide.component';
import { HireAnExpertComponent } from './dialog/hire-an-expert/hire-an-expert.component';
import { ArticleEditerComponent } from './dialog/article-editer/article-editer.component';
import { ActiveBoostingComponent } from './dialog/active-boosting/active-boosting.component';
import { AddArticleOutlineComponent } from './dialog/add-article-outline/add-article-outline.component';
import { VerifyEmailComponent } from './dialog/verify-email/verify-email.component';
import { AddBillingCardComponent } from './dialog/add-billing-card/add-billing-card.component';
import { UpgradePlanComponent } from './dialog/upgrade-plan/upgrade-plan.component';
import { MobilePromptDialogComponent } from './common/mobile-prompt-dialog/mobile-prompt-dialog.component';
import { PostRescheduleComponent } from './dialog/post-reschedule/post-reschedule.component';
import { CampaignInfoComponent } from './dialog/campaign-info/campaign-info.component';
import { GenerateArticleBannerComponent } from './dialog/generate-article-banner/generate-article-banner.component';
import { DeleteConfirmationPopupComponent } from './common/delete-confirmation-popup/delete-confirmation-popup.component';
import { AudioListComponent } from './dialog/audio-list/audio-list.component';
import { WarningEditPostComponent } from './dialog/warning-edit-post/warning-edit-post.component';
import { AiImageGenerateComponent } from './dialog/ai-image-generate/ai-image-generate.component';
import { CrmGetEmailComponent } from './dialog/crm-get-email/crm-get-email.component';
import { CrmGetEmailCreditComponent } from './dialog/crm-get-email-credit/crm-get-email-credit.component';
import { AdminJobRequestFilterComponent } from './dialog/admin-job-request-filter/admin-job-request-filter.component';
import { CampaignForCompanyPageComponent } from './dialog/campaign-for-company-page/campaign-for-company-page.component';
import { ImageStyleComponent } from './dialog/image-style/image-style.component';
import { CarouselTemplateListComponent } from './dialog/carousel-template-list/carousel-template-list.component';
import { FollowerListComponent } from './dialog/follower-list/follower-list.component';
import { CreditOverViewComponent } from './dialog/credit-over-view/credit-over-view.component';
import { CreditBuyComponent } from './dialog/credit-buy/credit-buy.component';
import { CustomFilterdialogComponent } from './dialog/custom-filterdialog/custom-filterdialog.component';
import { CarouselTemplatePreviewComponent } from './dialog/carousel-template-preview/carousel-template-preview.component';
import { DeleteCarouselConformationComponent } from './common/delete-carousel-conformation/delete-carousel-conformation.component';
import { CreateBrandKitAlertComponent } from './dialog/create-brand-kit-alert/create-brand-kit-alert.component';
import { SelectMediaComponent } from './common/select-media/select-media.component';
import { SuggestIdeaComponent } from './common/suggest-idea/suggest-idea.component';
import { AiPreviewImageComponent } from './common/ai-preview-image/ai-preview-image.component';

@NgModule({
  declarations: [
    PaginationComponent,
    LoaderComponent,
    EditLinkedinPostComponent,
    PostScheduleDialogComponent,
    PlanUpgradeDialogComponent,
    GenerateCommonPromptComponent,
    GiphyListComponent,
    PixelImageVideoComponent,
    SwitchProfileComponent,
    AiSettingComponent,
    ConfirmPostScheduledComponent,
    AddCustomCarouselThemeComponent,
    SaveThemeComponent,
    PlayIntroVideoComponent,
    SinglePostDetailsComponent,
    OneClickGenerationComponent,
    ProgressivePopupComponent,
    GeneratedAivideoListComponent,
    OnboardIntegrationIntroComponent,
    ViewCarouselSlideComponent,
    HireAnExpertComponent,
    ArticleEditerComponent,
    ActiveBoostingComponent,
    AddArticleOutlineComponent,
    VerifyEmailComponent,
    AddBillingCardComponent,
    UpgradePlanComponent,
    MobilePromptDialogComponent,
    PostRescheduleComponent,
    CampaignInfoComponent,
    GenerateArticleBannerComponent,
    DeleteConfirmationPopupComponent,
    AudioListComponent,
    WarningEditPostComponent,
    AiImageGenerateComponent,
    CrmGetEmailComponent,
    CrmGetEmailCreditComponent,
    AdminJobRequestFilterComponent,
    CampaignForCompanyPageComponent,
    ImageStyleComponent,
    CarouselTemplateListComponent,
    FollowerListComponent,
    CreditOverViewComponent,
    CreditBuyComponent,    
    CustomFilterdialogComponent,
    CarouselTemplatePreviewComponent,
    DeleteCarouselConformationComponent,
    CreateBrandKitAlertComponent,
    SelectMediaComponent,
    SuggestIdeaComponent,   
    AiPreviewImageComponent,    
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatTooltipModule,
    GlobalMatModule,
    MatDialogModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    ColorSketchModule,
    SlickCarouselModule,
    AngularEditorModule,
    DragDropModule,
    NgOtpInputModule,
    NgxColorsModule,
    NgxUiLoaderModule,
    ClipboardModule,
    InfiniteScrollModule,  
    SwiperModule  
  ],
  exports: [
    MatTooltipModule,
    PaginationComponent,
    LoaderComponent,
    GlobalMatModule,
    PostScheduleDialogComponent,
    AngularEditorModule,
    SlickCarouselModule,
    NgxUiLoaderModule,
    InfiniteScrollModule,
    SwiperModule,
    CreditOverViewComponent,
    DragDropModule
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class SharedModule {}
