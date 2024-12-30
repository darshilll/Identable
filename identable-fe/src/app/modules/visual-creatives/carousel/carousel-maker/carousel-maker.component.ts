import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { CarouselService } from '../../../../providers/carousel/carousel.service';

// COMPONENTS
import { SetBackgroundImageComponent } from '../../dialog/set-background-image/set-background-image.component';
import { SelectMediaComponent } from '../../../../shared/common/select-media/select-media.component';
import { DeleteConfirmationPopupComponent } from '../../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';
import { GeneralService } from 'src/app/providers/general/general.service';

// LIBRARY
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { MatDialog } from '@angular/material/dialog';
import MediumEditor from 'medium-editor';

import 'emoji-picker-element';

import { MediumEditorDirective } from '../../editor-directive/medium-editor.directive'; // Import your directive

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { designControl } from '../../../../utils/carousel-control/design-control';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
]);

@Component({
  selector: 'app-carousel-maker',
  templateUrl: './carousel-maker.component.html',
  styleUrls: ['./carousel-maker.component.scss'],
})
export class CarouselMakerComponent {
  @ViewChild('htmlContent', { static: false }) htmlContent!: ElementRef;
  @ViewChildren('carouselSlide') slides!: QueryList<ElementRef>;
  @ViewChild(MediumEditorDirective)
  mediumEditorDirective!: MediumEditorDirective;
  @ViewChildren('editor') editors!: QueryList<ElementRef>;
  editorInstances = [];
  currentEditor: any;

  pdfUrl: any;

  // Active control
  selectedControl: string = 'Layers';

  // Design option
  bgImageOpacity: any = 50;

  // Layout option
  slideLayout: any;

  //Text settings
  fontPairFamily: any;
  titleFamily: any;
  descriptionFamily: any;
  titlefontSize: any;
  descriptionFontSize: any;

  // Profile Setting
  handleDesigText: any;

  currentTemplate: any;

  dynamicStyle: any = {};

  // Pattern design option
  patternOpacity: number = 50;
  patternDesign: any;

  // Upload image dialog
  dialogRef: any;

  carouselId: any;
  carouselName: any;
  carouselIdea: any;
  carouselLength: any;
  choiceTemplatesId: any;
  themeType: any;

  editorConfig = {
    toolbar: {
      buttons: [
        {
          name: 'justifyLeft',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-5.png" alt="editor-icons" />', // Left align icon
        },
        {
          name: 'justifyCenter',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-6.png" alt="editor-icons" />', // Center align icon
        },
        {
          name: 'justifyRight',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-7.png" alt="editor-icons" />', // Right align icon
        },
        // {
        //   name: 'justifyFull',
        //   contentDefault: '<i class="fas fa-align-justify"></i>', // Justify icon
        // },
        {
          name: 'bold',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-2.png" alt="editor-icons" />',
        },
        {
          name: 'italic',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-3.png" alt="editor-icons" />',
        },
        {
          name: 'underline',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-4.png" alt="editor-icons" />',
        },
        {
          name: 'colorPicker',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-1.png" alt="editor-icons" />',
        },
        {
          name: 'h5',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-10.png" alt="editor-icons" />',
        },
        {
          name: 'h4',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-11.png" alt="editor-icons" />',
        },
        {
          name: 'h3',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-12.png" alt="editor-icons" />',
        },
        {
          name: 'unorderedlist',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-8.png" alt="editor-icons" />', // Bullet list icon
        },
        {
          name: 'orderedlist',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-9.png" alt="editor-icons" />', // Numbered list icon
        },
        {
          name: 'regenerate',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/re-fresh.svg" alt="editor-icons" />',
        },
        {
          name: 'emojiPicker',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-20.png" alt="editor-icons" />',
        },
        {
          name: 'regenerateContent',
          contentDefault:
            '<img class="align-middle" width="24" src="assets/images/carousels-v2/re-fresh.svg" alt="editor-icons" />',
        },
      ],
    },
    extensions: {
      colorPicker: this.editorColorButton(),
      emojiPicker: this.editorEmojiButton(),
      regenerateContent: this.editorRegenerateButton(),
    },
    placeholder: {
      text: 'Start typing here...',
    },
  };

  content = 'Edit this text with MediumEditor!';

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
  };

  // Top Editor
  selectedElement: HTMLElement | null = null;

  // Content image toolbar
  isContentImgTool: boolean = false;
  activeContentImgIndex: any;

  // Templates list
  carouselTemplates: any;

  selectedSlide: any;
  isShowHeaderEditor: boolean = false;
  editorAction = {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    align: '',
    size: '',
  };

  constructor(
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private designControlService: DesignControlService,
    private carouselTemplatesService: CarouselTemplatesService,
    private _carouselService: CarouselService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _brandkit: BrandKitService,
    public _generalService: GeneralService
  ) {
    // Get the template by ID
    this.carouselId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.initView();
    if (this.carouselId) {
      this.designControlService.aiIdeanContent$.subscribe((data) => {
        if (data?.genratedType === 'template' && data?.isEditable) {
          this.fetchCarouselTemplates(data, data?.genratedType);
        }
      });
      this.patchCarouselTemplates();
    } else {
      // Fetch Current templates

      this.designControlService.aiIdeanContent$.subscribe((data) => {
        if (data?.choiceTemplatesId) {
          if (data?.genratedType === 'template') {
            this.fetchCarouselTemplates(data, data?.genratedType);
          } else if (data?.genratedType === 'savetemplate') {
            this.fetchCarouselTemplates(data, data?.genratedType);
          } else {
            this.fetchPresetsTemplates(data);
          }
        } else {
          this.currentTemplate = this.carouselTemplatesService.getTemplateById(
            designControl?.defaultTemplate
          );

          this.currentTemplate.profileAvtar = this._utilities.currentProfile
            ?.image
            ? this._utilities.currentProfile?.image
            : 'assets/images/avatar/avatar.png';
          this.currentTemplate.profileHandle =
            this._utilities.currentProfile?.designation;

          // Update design settings

          this.updateCarouselSetting(this.currentTemplate);
        }
      });
    }
    this.designControlService.selectedLayout$.subscribe((layout) => {
      this.slideLayout = layout;
    });
    console.log('this.currentTemplate', this.currentTemplate);
  }

  froalaOptions: any = {
    charCounterCount: true,
    toolbarInline: true, // Enables inline toolbar
    toolbarVisibleWithoutSelection: true,
    quickInsertTags: [],
    events: {
      contentChanged: (e: any) => {
        console.log('Content was changed.');
      },
    },
  };

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this.handleDesigText = this._utilities.currentProfile?.designation;
  }

  closeSideBar() {
    this.selectedControl = '';
  }

  fetchCarouselTemplates(choiceData: any, type: any) {
    let templateData;

    if (type === 'template') {
      console.log(
        'this._utilities.carouselTemplateArray',
        this._utilities.carouselTemplateArray
      );
      templateData = this._utilities.carouselTemplateArray.find(
        (t: any) => t.templateId === choiceData?.choiceTemplatesId
      );
    } else {
      templateData = this._utilities.carouselSaveTemplateArray.find(
        (t: any) => t._id === choiceData?.choiceTemplatesId
      );
      templateData = templateData?.carouselSetting;
    }

    if (choiceData?.isGenratedFirst) {
      this.currentTemplate =
        this.carouselTemplatesService.updateSettingByTemplateId(
          templateData,
          choiceData?.choiceTemplatesId,
          choiceData?.content
        );
    } else {
      this.currentTemplate =
        this.carouselTemplatesService.isExistingContentByTemplate(
          templateData,
          this.currentTemplate,
          choiceData?.content
        );
    }

    this.carouselName = choiceData?.carouselName;
    this.carouselIdea = choiceData?.carouselIdea;
    this.choiceTemplatesId = choiceData?.choiceTemplatesId;
    this.themeType = choiceData?.themeType;

    if (choiceData?.themeType === 'brandkit') {
      this.currentTemplate.isBrandKit = true;
      this.getBrandKit();
    } else {
      // Update the profile image
      this.currentTemplate.profileAvtar = this._utilities.currentProfile?.image
        ? this._utilities.currentProfile?.image
        : 'assets/images/avatar/avatar.png';
      this.currentTemplate.profileHandle =
        this._utilities.currentProfile?.designation;
    }

    // Update design settings

    this.updateCarouselSetting(this.currentTemplate);
  }

  fetchPresetsTemplates(choiceData: any) {
    const templateData = this._utilities.presetCarouselTemplateObject;

    if (choiceData?.isGenratedFirst) {
      this.currentTemplate =
        this.carouselTemplatesService.updateSettingByTemplateId(
          templateData,
          choiceData?.choiceTemplatesId,
          choiceData?.content
        );
    } else {
      this.currentTemplate =
        this.carouselTemplatesService.isExistingContentByTemplate(
          templateData,
          this.currentTemplate,
          choiceData?.content
        );
    }

    this.carouselName = choiceData?.carouselName;
    this.carouselIdea = choiceData?.carouselIdea;
    this.choiceTemplatesId = choiceData?.choiceTemplatesId;
    this.themeType = choiceData?.themeType;

    if (choiceData?.themeType === 'brandkit') {
      this.currentTemplate.isBrandKit = true;
      this.getBrandKit();
    } else {
      // Update the profile image
      this.currentTemplate.profileAvtar = this._utilities.currentProfile?.image
        ? this._utilities.currentProfile?.image
        : 'assets/images/avatar/avatar.png';
      this.currentTemplate.profileHandle =
        this._utilities.currentProfile?.designation;
    }

    // Update design settings

    this.updateCarouselSetting(this.currentTemplate);
  }

  // Get Brand Kit

  getBrandKit() {
    let param = {};
    this._brandkit.list(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          var brandKitData = response?.data;

          // Update the brandkit logo

          this.currentTemplate.profileAvtar = brandKitData?.logoUrl
            ? brandKitData?.logoUrl
            : 'assets/images/avatar/avatar.png';
          this.currentTemplate.profileHandle =
            this._utilities.currentProfile?.designation;

          // Update the brandkit font family

          this.titleFamily = brandKitData?.titleFont;
          this.descriptionFamily = brandKitData?.bodyFont;

          // Update the colors

          this.handleChangeColorSetting({
            backgroundColor: brandKitData?.primaryColor,
            textColor: brandKitData?.secondaryColor,
            subColor: brandKitData?.accent1Color,
            subBackgroundColor: brandKitData?.accent2Color,
          });
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  // Drag and drop slides

  drop(event: CdkDragDrop<string[]>) {
    // Update the order of slides when a drag-drop event happens
    moveItemInArray(
      this.currentTemplate?.slides,
      event.previousIndex,
      event.currentIndex
    );
    // Emit the new order to parent component
  }

  // Top editor

  showToolbar(event: MouseEvent) {
    const target = event.target as HTMLElement;
    this.selectedElement = target;
  }

  applyCommand(command: string) {
    if (this.selectedElement) {
      document.execCommand(command, false, undefined);
    }
  }

  patchCarouselTemplates() {
    this._loader.start();

    this._carouselService
      .getCustomTemplate({ templateId: this.carouselId })
      .subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.currentTemplate = response?.data?.carouselSetting;

            this.carouselName = response?.data?.carouselName;
            this.carouselIdea = response?.data?.carouselIdea;
            this.slideLayout = this.currentTemplate?.layout;

            this.designControlService.setCarouselIdeaContent({
              choiceTemplatesId: response?.data?._id,
              themeType: '',
              content: response?.data?.carouselSetting?.slides,
              carouselName: response?.data?.carouselName,
              carouselIdea: response?.data?.carouselIdea,
              carouselLength: response?.data?.carouselLength,
              genratedType: 'template',
              isGenratedFirst: false,
              isEditable: false,
            });

            this.updateCarouselSetting(this.currentTemplate);
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
        },
        (err: ErrorModel) => {
          this._loader.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
        }
      );
  }

  updateCarouselSetting(setting: any) {
    this.setPatternDesign(setting?.bgPattern);
    this.setPatternOpacity(setting?.bgPatternOpacity);

    this.slideLayout = setting?.layout;

    // Patch Font Settings
    this.handleFontPair(setting?.fontPair);
    this.handleTitleFont(setting?.titlefont);
    this.handleTitleFontSize(setting?.titlefontSize);
    this.handleDescriptionFont(setting?.descriptionFont);
    this.handleDescriptionFontSize(setting?.descriptionFontSize);

    this.designControlService.updateTemplateSettings(setting);
  }

  // Upload Background

  choiceBackgroundMedia(imageType: any, slideData: any, slideIndex: any) {
    this.dialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      disableClose: false,      
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (imageType === 'bgImage' && result?.url) {
        this.currentTemplate.slides[slideIndex].backgroundImage = result?.url;
      } else if (imageType === 'contentImg' && result?.url) {
        this.currentTemplate.slides[slideIndex].showImage = false;
        this.currentTemplate.slides[slideIndex].contentImage = result?.url;
      }
    });
  }

  // Content Image Tools

  showContentImgTools(slidData: any, index: any) {
    //this.isContentImgTool = true;
    this.activeContentImgIndex = index;
  }

  applyImageAlignTools(type: any, index: any) {
    this.currentTemplate.slides[index].contentImgAlign = type;
  }

  applyImageFit(type: any, index: any) {
    this.currentTemplate.slides[index].contentImgFit = type;
  }

  removeSlideContentImg(imageType: any, slideData: any, slideIndex: any) {
    this.currentTemplate.slides[slideIndex].showImage = true;
    this.currentTemplate.slides[slideIndex].contentImage = '';
  }

  // Background image opacity

  onBgImageOpacityChange(event: any, slideIndex: any) {
    this.bgImageOpacity = event.target.value;
    this.currentTemplate.slides[slideIndex].bgImageOpacity =
      event.target.value / 100;
  }

  handleBackgroundOpacity(event: any) {
    this.bgImageOpacity = event;
    this.currentTemplate.slides.forEach((slide: any, index: any) => {
      slide.bgImageOpacity = event / 100;
    });
  }

  // This method will be triggered when the sidebar emits a new menu selection

  onMenuSelected(menu: string) {
    this.selectedControl = menu;
  }

  // Handle the slide settings

  onSlideOrderChanged(newSlideOrder: any) {
    this.currentTemplate.slides = newSlideOrder;
    // Handle the updated slide order here
  }

  changeSlideVisibility(newSlideOrder: any) {
    this.currentTemplate.slides = newSlideOrder.filter(
      (slide: any) => slide.isSldieVisible
    );
  }

  // Handle the visibility

  toggleVisibility(field: string, slide: any, index: number): void {
    this.currentTemplate.slides[index][field] =
      !this.currentTemplate.slides[index][field];
    if (field === 'showImage') {
      this.currentTemplate.slides[index].contentImage = ''; // Reset contentImage if toggling image
    }
  }

  // Handle the event emitted by app-layers when the image visibility is toggled

  handleToggleImage(event: { slide: any; index: number }): void {
    this.currentTemplate.slides[event.index].showImage = event.slide.showImage;
    this.currentTemplate.slides[event.index].contentImage = '';
  }

  handleToggleSubTitle(event: { slide: any; index: number }): void {
    this.currentTemplate.slides[event.index].showSubTitle =
      event.slide.showSubTitle;
  }

  handleToggleTitle(event: { slide: any; index: number }): void {
    this.currentTemplate.slides[event.index].showTitle = event.slide.showTitle;
  }

  handleToggleDescription(event: { slide: any; index: number }): void {
    this.currentTemplate.slides[event.index].showDescription =
      event.slide.showDescription;
  }

  handleProfileShots(event: { slide: any; index: number }): void {
    this.currentTemplate.slides[event.index].showProfileShot =
      event.slide.showProfileShot;
  }

  // Handle Color

  handleChangeColorSetting(event: {
    backgroundColor: any;
    textColor: any;
    subColor: any;
    subBackgroundColor: any;
  }): void {
    // Update in templates

    this.currentTemplate.textColor = event.textColor;
    this.currentTemplate.subColor = event.subColor;
    this.currentTemplate.backgroundColor = event.backgroundColor;
    this.currentTemplate.subBackgroundColor = event.subBackgroundColor;

    // Update slide colors globally
    this.currentTemplate.slides.forEach((slide: any, index: any) => {
      slide.backgroundColor = event.backgroundColor;
      slide.textColor = event.textColor;
      slide.subColor = event.subColor;

      if (this.currentTemplate?.isBoxBg) {
        slide.subBackgroundColor = event.subBackgroundColor + '8c';
      } else {
        slide.subBackgroundColor = event.subBackgroundColor;
      }
    });
  }

  // Handle The Text Changes

  handleFontPair(event: any): void {
    this.fontPairFamily = event;
    this.currentTemplate.fontPair = event;
  }

  handleTitleFont(event: any): void {
    this.titleFamily = event;
    this.currentTemplate.titlefont = event;
  }

  handleDescriptionFont(event: any): void {
    this.descriptionFamily = event;
    this.currentTemplate.descriptionFont = event;
  }

  handleTitleFontSize(event: any): void {
    this.titlefontSize = event;
    this.currentTemplate.titlefontSize = event;
  }

  handleDescriptionFontSize(event: any): void {
    this.descriptionFontSize = event;
    this.currentTemplate.descriptionFontSize = event;
  }

  // Design bakground

  handleBackground(event: any): void {
    if (event?.type === 'bgColor') {
      // Update in templates
      this.currentTemplate.backgroundColor = event.background;

      // Update slide colors globally
      this.currentTemplate.slides.forEach((slide: any, index: any) => {
        slide.backgroundGradients = '';
        slide.backgroundImage = '';
        slide.backgroundColor = event.background;
      });
    } else if (event?.type === 'bgImage') {
      this.currentTemplate.backgroundImage = event.background;
      this.currentTemplate.isBgImage       = true;
      this.currentTemplate.slides.forEach((slide: any, index: any) => {
        slide.backgroundImage = event.background;
      });
    } else if (event?.type === 'bgGradient') {
      this.currentTemplate.backgroundGradients = event.background;
      this.currentTemplate.slides.forEach((slide: any, index: any) => {
        slide.backgroundImage = '';
        slide.backgroundGradients = event.background;
      });
    }
  }

  // Design pattern setting

  setPatternOpacity(event: any) {
    this.patternOpacity = event / 100;
    this.currentTemplate.bgPatternOpacity = event;
  }

  setPatternDesign(event: any) {
    if (event != 'none') {
      this.patternDesign = event;
    } else {
      this.patternDesign = '';
    }
    this.currentTemplate.bgPattern = this.patternDesign;
  }

  // CTA setting

  handleQRvisible(event: { isQRvisible: any; QRtext: any }): void {
    this.currentTemplate.isQRvisible = event?.isQRvisible;
    this.currentTemplate.QRtext = event?.QRtext;
  }

  handleActionBtnText(event: any): void {
    this.currentTemplate.actionBtnText = event;
  }

  handleSwipeIndicator(event: {
    isSwipeBtnText: any;
    isSwipeBtnvisible: any;
  }): void {
    this.currentTemplate.isSwipeBtnText = event?.isSwipeBtnText;
    this.currentTemplate.isSwipeBtnvisible = event?.isSwipeBtnvisible;
  }

  handleBookmarkIndicator(event: any): void {
    this.currentTemplate.isBookMarkvisible = event;
  }

  // Handle Profile Setting

  toHandleDesigText(event: any): void {
    this.currentTemplate.profileHandle = event;
  }

  toHandleProfileVisible(event: any): void {
    this.currentTemplate.isProfileAvtarVisible = event?.isProfileAvtarVisible;
    this.currentTemplate.isHandleVisible = event?.isHandleVisible;
    this.currentTemplate.profileAvtar = event?.profileAvtar;
  }

  // Inner slider setting

  addNewSlide(index: any) {
    let bodySlidesData = this.currentTemplate?.slides.find(
      (item: any) => item.type === 'body_slide'
    );

    if (!bodySlidesData) {
      console.error('Body slide not found!');
      return;
    }

    // Clone the bodySlidesData and modify the content for the new slide
    let newSlide = {
      ...bodySlidesData,
      content: {
        ...bodySlidesData.content,
        heading: 'Title',
        description: 'Description',
      },
    };

    // Insert the new slide after the given index
    this.currentTemplate.slides.splice(index + 1, 0, newSlide);
  }

  duplicateSlide(slide: any, index: any) {
    this.currentTemplate.slides.splice(index + 1, 0, slide);
  }

  deleteSlide(index: number) {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {
        message:
          'Do you really want to delete thise slide? This process cannot be undone.',
      },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.currentTemplate.slides.splice(index, 1); // Remove slide by index
      }
    });
  }

  generateCarousel() {
    let obj = {
      slideLength: this.carouselLength ? this.carouselLength : 3,
      topic: this.carouselIdea,
    };
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._carouselService.createNewCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let carousel = response?.data;

          if (!carousel || carousel?.length == 0) {
            this._toastr.error(MessageConstant.unknownError, '');
            return;
          }

          let newSlideArray = [];

          const formattedSlides = carousel.map(
            (item: any, index: any, array: any) => {
              let type = 'body_slide';

              if (index === 0) {
                type = 'starting_slide';
              } else if (index === array.length - 1) {
                type = 'ending_slide';
              }

              return {
                type: type,
                content: {
                  heading: item.main || item.heading || item?.footer,
                  sub_heading: item.mainsubtitle || '',
                  description: item.description || '',
                },
                isSldieVisible: true,
                showTitle: true,
                showSubTitle: !!item.mainsubtitle, // Show subtitle if it exists
                showDescription: !!item.description, // Show description if it exists
                showImage: false,
                showProfileShot: true,
                contentImage: '',
              };
            }
          );

          this.designControlService.setCarouselIdeaContent({
            choiceTemplatesId: this.choiceTemplatesId,
            themeType: this.themeType,
            content: formattedSlides,
            carouselName: this.carouselName,
            carouselIdea: this.carouselIdea,
            carouselLength: this.carouselLength,
            genratedType: 'template',
            isGenratedFirst: false,
            isEditable: false,
          });
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  oneIdeaDailog() {
    let obj = { type: 'topic' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.carouselIdea = result;
      }
    });
  }

  reGenerateTopic() {
    if (!this.carouselIdea) {
      return;
    }
    this._loader.start();
    let param = {
      carouselTopic: this.carouselIdea,
      promptAction: 'carouselRegenereatTopic',
    };
    this._generalService.commonPrompt(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          var topic = response?.data?.data[0]?.data;

          this.carouselIdea = topic ? topic : this.carouselIdea;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  // ===================== Editor Option ================

  // Color Picker
  editorColorButton() {
    const MediumEditorWithExtensions = MediumEditor as any;

    const actionButton = MediumEditorWithExtensions.extensions.button.extend({
      name: 'colorPicker',
      init: function () {
        this.button = this.document.createElement('button');
        this.button.innerHTML =
          '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-1.png" alt="editor-icons" />';
        this.on(this.button, 'click', this.handleClick.bind(this));
      },
      handleClick: function () {
        const toolbar = document.querySelector(
          '.medium-editor-toolbar-active'
        ) as HTMLElement;
        const colorInput = document.getElementById(
          'color-input'
        ) as HTMLInputElement;

        if (toolbar && colorInput) {
          // Set the color input position near the toolbar
          const toolbarRect = toolbar.getBoundingClientRect();
          colorInput.style.display = 'block'; // Make the input visible when clicked
          colorInput.style.position = 'absolute';
          colorInput.style.top = `${toolbarRect.bottom + window.scrollY}px`; // Position below toolbar
          colorInput.style.left = `${toolbarRect.left + window.scrollX}px`; // Align to toolbar's left
          colorInput.click(); // Trigger the color input click to open the color picker
        }
      },
      getButton: function () {
        return this.button;
      },
    });
    return new actionButton();
  }

  onColorChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const color = inputElement.value;

    document.execCommand('foreColor', false, color);

    this.currentEditor.focus();
  }

  //Emoji Picker
  editorEmojiButton() {
    const MediumEditorWithExtensions = MediumEditor as any;

    const actionButton = MediumEditorWithExtensions.extensions.button.extend({
      name: 'emojiPicker',
      contentDefault:
        '<img class="align-middle" width="24" src="assets/images/carousels-v2/editor-icons-20.png" alt="editor-icons" />', // Emoji icon
      aria: 'Insert Emoji', // Accessibility text
      action: 'emoji-picker', // Custom action name
      handleClick: function (event: any) {
        console.log('Hello = ', event);
        event.preventDefault();
        event.stopPropagation();
        this.openEmojiPicker();
      },

      openEmojiPicker: function () {
        console.log('Test 101 ');
        let emojiPicker = document.querySelector('emoji-picker');

        if (!emojiPicker) {
          emojiPicker = document.createElement('emoji-picker');
          document.body.appendChild(emojiPicker);
        }

        console.log('emojiPicker = ', emojiPicker);

        emojiPicker.addEventListener('emoji-click', (event: any) => {
          const emoji = event.detail.unicode;
          this.insertEmoji(emoji);
          if (emojiPicker) {
            document.body.removeChild(emojiPicker); // Remove picker after emoji selection
          }
        });

        // Position emoji picker near the button

        const toolbar = document.querySelector(
          '.medium-editor-toolbar-active'
        ) as HTMLElement;
        const toolbarRect = toolbar.getBoundingClientRect();

        const button = this.button;
        const rect = button.getBoundingClientRect();

        emojiPicker.style.position = 'absolute';
        // emojiPicker.style.left = `${rect.left}px`;
        // emojiPicker.style.top = `${rect.bottom + window.scrollY}px`; // Account for scroll
        emojiPicker.style.top = `${toolbarRect.bottom + window.scrollY}px`; // Position below toolbar
        emojiPicker.style.left = `${toolbarRect.left + window.scrollX}px`; // Align to toolbar's left

        emojiPicker.style.zIndex = '10000'; // Make sure it's above all other content

        emojiPicker.style.display = 'block'; // Ensure it is shown
        emojiPicker.style.visibility = 'visible';
      },

      insertEmoji: function (emoji: string) {
        console.log('Test 102 ');
        const selection = window.getSelection() as any;
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Remove selected text (if any)

        // Insert the emoji at the cursor position
        const textNode = document.createTextNode(emoji);
        range.insertNode(textNode);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      },
      getButton: function () {
        return this.button;
      },
    });
    return new actionButton();
  }

  editorRegenerateButton() {
    const MediumEditorWithExtensions = MediumEditor as any;

    const actionButton = MediumEditorWithExtensions.extensions.button.extend({
      name: 'regenerateContent',
      init: function () {
        this.button = this.document.createElement('button');
        this.button.innerHTML =
          '<img class="align-middle" width="24" src="assets/images/carousels-v2/re-fresh.svg" alt="editor-icons" />';
        this.on(this.button, 'click', this.handleClick.bind(this));
      },
      handleClick: function () {
        const toolbar = document.querySelector(
          '.medium-editor-toolbar-active'
        ) as HTMLElement;
        const colorInput = document.getElementById(
          'editor-regenerate-content'
        ) as HTMLInputElement;
        colorInput.click();
      },
      getButton: function () {
        return this.button;
      },
    });
    return new actionButton();
  }

  executeEditorAction(action: string) {
    const editor = this.mediumEditorDirective.getEditorInstance();
    if (editor) {
      editor.execAction(action); // Execute the desired action (e.g., 'bold', 'italic', etc.)
    }
    this.currentEditor.focus();
  }

  applyHeading(heading: string) {
    this.currentEditor.focus();

    const editorElement = this.currentEditor;

    if (!editorElement) return;

    // Get the current content of the editor
    let editorContent = editorElement.innerHTML;

    // Remove any existing heading tags from the content
    editorContent = editorContent.replace(/<\/?h[1-6]>/g, '');

    // Create a new heading element with the entire content inside it
    const newHeading = document.createElement(heading);
    newHeading.innerHTML = editorContent;

    // Replace the editor content with the new heading
    editorElement.innerHTML = ''; // Clear the editor content
    editorElement.appendChild(newHeading); // Append the new heading with all content

    // Set focus back to the editor
    newHeading.focus();
  }

  setCurrentEditor(editor: any, slide: any) {
    console.log('focus');
    this.currentEditor = editor;
    this.selectedSlide = slide;
    this.isShowHeaderEditor = true;
  }

  executeEditorColorAction() {
    // Assume you have a reference to the color picker button in your header
    const colorPickerButton = document.getElementById(
      'color-picker-button'
    ) as HTMLElement; // Replace with your actual button ID
    const colorInput = document.getElementById(
      'color-input'
    ) as HTMLInputElement;

    if (colorPickerButton && colorInput) {
      // Set the color input position below the color picker button
      const buttonRect = colorPickerButton.getBoundingClientRect();
      colorInput.style.display = 'block'; // Make the input visible when clicked
      colorInput.style.position = 'absolute';
      colorInput.style.top = `${buttonRect.bottom + window.scrollY}px`; // Position below the button
      colorInput.style.left = `${buttonRect.left + window.scrollX}px`; // Align to the button's left
      colorInput.click(); // Trigger the color input click to open the color picker
    }
  }
  executeEditorEmojiAction() {
    console.log('Opening emoji picker');
    let emojiPicker = document.querySelector('emoji-picker');

    // Create emoji picker if it doesn't exist
    if (!emojiPicker) {
      emojiPicker = document.createElement('emoji-picker');
      document.body.appendChild(emojiPicker);
    }

    console.log('emojiPicker = ', emojiPicker);

    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPicker && !emojiPicker.contains(event.target as Node)) {
        document.body.removeChild(emojiPicker);
        document.removeEventListener('click', handleClickOutside);
      }
    };

    // Handle emoji selection

    emojiPicker.addEventListener('emoji-click', (event: any) => {
      const emoji = event.detail.unicode;
      this.insertEmoji(emoji);
      // if (emojiPicker) {
      //   document.body.removeChild(emojiPicker); // Remove picker after emoji selection
      // }
    });

    // Position emoji picker near the button
    const button = document.getElementById(
      'emoji-picker-button'
    ) as HTMLElement; // Replace with your actual button reference
    if (button) {
      const rect = button.getBoundingClientRect();

      emojiPicker.style.position = 'absolute';
      emojiPicker.style.top = `${rect.bottom + window.scrollY}px`; // Position below the button
      emojiPicker.style.left = `${rect.left + window.scrollX}px`; // Align to button's left

      emojiPicker.style.zIndex = '10000'; // Make sure it's above all other content
      emojiPicker.style.display = 'block'; // Ensure it is shown
      emojiPicker.style.visibility = 'visible';

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      // document.addEventListener('click', handleClickOutside);
    } else {
      console.error('Button not found');
    }
  }

  insertEmoji(emoji: any) {
    const selection = window.getSelection() as any;
    const range = selection.getRangeAt(0);
    range.deleteContents(); // Remove selected text (if any)

    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onEditorBlur(editor: any) {
    console.log('Editor blurred');
    this.selectedSlide = null;

    setTimeout(() => {
      if (!this.selectedSlide) {
        this.isShowHeaderEditor = false;
      }
    }, 1000);
  }

  onToolbarRegenerateClick() {
    this.currentEditor.focus();
    setTimeout(() => {
      this.generateCarouselContent();
    }, 500);
  }

  generateCarouselSlide(slide: any) {
    if (!slide) {
      this._toastr.error('Please select slide', '');
      return;
    }

    let obj = {
      slideType: slide?.type,
      topic: this.carouselIdea,
    };
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._carouselService.generateCarouselSlide(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let carouselSlide = response?.data;

          if (carouselSlide?.length == 0) {
            this._toastr.error(MessageConstant.unknownError, '');
            return;
          }

          let item = carouselSlide[0];
          if (slide?.type == 'starting_slide') {
            slide.content = {
              heading: item.main || item.heading || item?.footer,
            };
          } else if (slide?.type == 'ending_slide') {
            slide.content = {
              heading: item.main || item.heading || item?.footer,
            };
          } else {
            slide.content = {
              heading: item.main || item.heading || item?.footer,
              sub_heading: item.mainsubtitle || '',
              description: item.description || '',
            };
          }

          console.log('slide = ', slide);
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  generateCarouselContent() {
    if (!this.currentEditor) {
      this._toastr.error('Please select slide', '');
      return;
    }

    let obj = {
      content: this.currentEditor?.innerHTML,
      topic: this.carouselIdea,
    };
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._carouselService.generateCarouselContent(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          if (response?.data) {
            this.currentEditor.innerHTML = response?.data;
          }
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }
}
