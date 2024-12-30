import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Handlebars from 'handlebars';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { PostService } from '../../../providers/post/post.service';

// COMPONENTS
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { commonConstant } from '../../../utils/common-functions/common-constant';

import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

@Component({
  selector: 'app-carousel-generator',
  templateUrl: './carousel-generator.component.html',
  styleUrls: ['./carousel-generator.component.scss'],
})
export class CarouselGeneratorComponent {
  // Carousel Setting Tab
  contentSetting: boolean = true;
  userInfoSetting: boolean = false;
  themeSetting: boolean = false;
  previewSetting: boolean = false;

  pdfUrl: any;

  // Profile Info
  isName: boolean = true;
  isHandler: boolean = true;
  isProfilePic: boolean = true;

  userName: string = '';
  userHandler: string = '';
  userProfilePic: any;

  // Theme Settings
  theme = {
    isSolidBackground: false,
    backgroundColor: '',
    primaryColor: '',
    secondaryColor: '',
    backgroundImage: '',
    primaryFont: '',
    secondaryFont: '',
  };

  // Content
  content = {
    isTitle: false,
    isContent: false,
    isContentBackground: false,
    titleValue: '',
    contentValue: '',
    contentBackgroundValue: '',
  };

  @ViewChild('htmlContent', { static: false }) htmlContent!: ElementRef;
  @ViewChildren('slide') slides!: QueryList<ElementRef>;

  selectedSlide: any;
  selectedSlideIndex: number = 0;
  dynamicContent: SafeHtml = '';

  topic: string = '';
  carouselLength: number = 3;
  selectedPromtTheme: string = 'General';

  currentProfile: any;

  // Slider Config
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };

  dialogRef: any;
  scheduleDialogOpen: boolean = false;

  isCarouselGenerated: boolean = false;

  creditDeducated: number = 0;
  creditMessage: any;

  constructor(
    private router: Router,
    public _utilities: CommonFunctionsService,
    private sanitizer: DomSanitizer,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _carouselService: CarouselService,
    private _dialog: MatDialog,
    public _generalService: GeneralService,
    public _globalService: GlobalService,
    private _postService: PostService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.carouselCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  ngOnInit(): void {
    this.initView();
    if (!this._utilities.selectedTheme) {
      this.router.navigate(['/carousels']);
    }

    // Profile Info
    this.currentProfile = this._utilities.currentProfile;
    this.userName = this.currentProfile?.name;
    this.userHandler = this.currentProfile?.url;

    this.setUserImage();

    // Theme Settings
    this.theme.backgroundColor = this._utilities.selectedTheme?.backgroundColor;
    this.theme.primaryColor = this._utilities.selectedTheme?.primaryColor;
    this.theme.secondaryColor = this._utilities.selectedTheme?.secondaryColor;
    this.theme.backgroundImage = this._utilities.selectedTheme?.backgroundImage;
    this.theme.primaryFont = this._utilities.selectedTheme?.primaryFont;
    this.theme.secondaryFont = this._utilities.selectedTheme?.secondaryFont;
    this.theme.isSolidBackground =
      this._utilities.selectedTheme?.isSolidBackground;

    this.onSlideAction(this._utilities.selectedTheme?.slideHtml[0], 0);
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
  }

  carouselLengthCount(count: boolean) {
    if (count) {
      if (this.carouselLength < 10) {
        this.carouselLength++;
      }
    } else {
      if (this.carouselLength > 3) {
        this.carouselLength--;
      }
    }
  }

  async setUserImage() {
    const data = await fetch(this._utilities.currentProfile?.image);
    const blob = await data.blob();

    var vm = this;
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      var base64data = reader.result;
      this.userProfilePic = base64data;
    };
  }

  getHtml(item: any, i: number) {
    const template = Handlebars.compile(item?.html);

    if (this.selectedSlideIndex == i) {
      item['title'] = this.content.titleValue;
      item['content'] = this.content.contentValue;
      item['contentImage'] = this.content.contentBackgroundValue;
    }

    let context = {
      backgroundColor: this.theme.backgroundColor,
      primaryColor: this.theme.primaryColor,
      secondaryColor: this.theme.secondaryColor,
      primaryFont: this.theme.primaryFont,
      secondaryFont: this.theme.secondaryFont,
      backgroundImage: this.theme.isSolidBackground
        ? ''
        : `url(${this.theme.backgroundImage})`,
      title: item?.title,
      content: item?.content,
      contentImage: item?.contentImage,
      userName: this.isName ? this.userName : '',
      userHandle: this.isHandler ? this.userHandler : '',
      userImage: this.isProfilePic
        ? this.userProfilePic
        : 'assets/images/avatar/avatar.png',
    };

    let newHtml = template(context);
    return this.sanitizer.bypassSecurityTrustHtml(newHtml);
  }

  onCopySlide(item: any, i: number) {
    this._utilities.selectedTheme?.slideHtml.splice(i + 1, 0, item);
  }

  onDeleteSlide(item: any, i: number) {
    this._utilities.selectedTheme?.slideHtml.splice(i, 1);
  }

  //========== Content ================

  onFileChanged(event: any, type: any) {
    let image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {
      if (type == 'profile') {
        this.userProfilePic = reader.result as string;
      } else if (type == 'content') {
        this.content.contentBackgroundValue = reader.result as string;
      } else if (type == 'background') {
        this.theme.backgroundImage = reader.result as string;
      }
    };
  }

  onContentPicDelete() {
    this.content.contentBackgroundValue = '';
  }

  onSlideAction(item: any, i: number) {
    this.selectedSlide = item;
    this.selectedSlideIndex = i;

    this.content.isTitle = this.selectedSlide?.isTitle;
    this.content.isContent = this.selectedSlide?.isContent;
    this.content.isContentBackground = this.selectedSlide?.isContentImage;
    this.content.titleValue = this.selectedSlide?.title;
    this.content.contentValue = this.selectedSlide?.content;
    this.content.contentBackgroundValue = this.selectedSlide?.contentImage;
  }

  async onSaveAction() {
    this._loader.start();
    const slidesArray = this.slides.toArray();
    const pdf = new jsPDF({
      unit: 'mm',
      format: [100, 120],
    });
    pdf.setFillColor(255, 255, 255, 0);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      'F'
    );

    for (let index = 0; index < slidesArray.length; index++) {
      const slide = slidesArray[index];
      if (slide) {
        const imgData = await html2canvas(slide.nativeElement, {
          backgroundColor: 'transparent',
        }).then((canvas) => canvas.toDataURL('image/png'));

        pdf.addImage(imgData, 'PNG', 0, 0, 100, 120);

        if (index !== slidesArray.length - 1) {
          pdf.addPage();
        }
      }
    }

    pdf.save('identable-carousels.pdf');

    this._loader.stop();
  }

  // Change the tab
  changeSetting(type: any) {
    if (type == 'content') {
      this.contentSetting = true;
      this.userInfoSetting = false;
      this.themeSetting = false;
      this.previewSetting = false;
    } else if (type == 'userInfo') {
      this.contentSetting = false;
      this.userInfoSetting = true;
      this.themeSetting = false;
      this.previewSetting = false;
    } else if (type == 'theme') {
      this.contentSetting = false;
      this.userInfoSetting = false;
      this.themeSetting = true;
      this.previewSetting = false;
    } else if (type == 'preview') {
      this.contentSetting = false;
      this.userInfoSetting = false;
      this.themeSetting = false;
      this.previewSetting = true;
    } else if (type == 'themesolid') {
      this.theme.isSolidBackground = true;
    } else if (type == 'themeimage') {
      this.theme.isSolidBackground = false;
    }
  }

  onBack() {
    this.router.navigate(['/carousels']);
  }

  generateCarousel() {
    if (!this.topic) {
      return;
    }
    let obj = {
      topic: this.topic,
      length: this.carouselLength,
      promtTheme: this.selectedPromtTheme,
    };
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._carouselService.generateCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let carousel = response?.data;

          if (!carousel || carousel?.length == 0) {
            this._toastr.error(MessageConstant.unknownError, '');
            return;
          }
          if (this._utilities.selectedTheme?.slideHtml?.length <= 2) {
            this._toastr.error(MessageConstant.unknownError, '');
            return;
          }

          let newSlideArray = [];

          // First Slide
          let firstSlide = this._utilities.selectedTheme?.slideHtml[0];
          firstSlide['title'] = carousel[0].main || this.topic;

          newSlideArray.push(firstSlide);

          // Middle Slide
          for (let i = 1; i < carousel?.length; i++) {
            const dataDic = carousel[i];

            let middleSlide = JSON.parse(
              JSON.stringify(this._utilities.selectedTheme?.slideHtml[1])
            );
            middleSlide['title'] = dataDic?.title;
            middleSlide['content'] = dataDic?.content;
            middleSlide['contentImage'] = '';
            newSlideArray.push(middleSlide);
          }

          // Last Slide
          let lastSlide =
            this._utilities.selectedTheme?.slideHtml[
              this._utilities.selectedTheme?.slideHtml?.length - 1
            ];
          newSlideArray.push(lastSlide);

          this._utilities.selectedTheme.slideHtml = newSlideArray;

          this.onSlideAction(this._utilities.selectedTheme?.slideHtml[0], 0);

          if (carousel?.length > 0) {
            this.isCarouselGenerated = true;
          }
          this._utilities.manageCredit(false, this.creditDeducated);
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

  openEditPost(index?: any) {
    let payload = {};

    let carouselArray = [];

    for (let i = 0; i < this._utilities.selectedTheme?.slideHtml?.length; i++) {
      carouselArray.push(
        this.getHtml(this._utilities.selectedTheme?.slideHtml[i], i)
      );
    }

    let documentDescription = this.topic;

    if (this._utilities.selectedTheme?.slideHtml?.length > 0) {
      documentDescription = this._utilities.selectedTheme?.slideHtml[0]?.title;
    }

    payload = {
      isGeneratePost: true,
      generatedType: commonConstant.POSTGENERATETYPE.CAROUSEL,
      postBody: this.topic,
      postMediaType: commonConstant.POSTGENERATETYPE.CAROUSEL,
      postMedia: '',
      carouselTemplate: carouselArray,
      documentDescription: documentDescription?.substring(0, 40),
      isCustomMedia: true,
    };

    payload = {
      ...payload,
      currentProfile: this._utilities.currentProfile,
    };

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      disableClose: true,
      data: payload,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!result?.isSaveDraft) {
          this.openConfirmPostScheduled();
          this.isCarouselGenerated = false;
        }
      }
    });
  }

  async generatePDF(scheduleData: any) {
    this._loader.start();

    const slidesArray = this.slides.toArray();

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 120],
    });
    pdf.setFillColor(255, 255, 255, 0);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      'F'
    );

    for (let index = 0; index < slidesArray.length; index++) {
      const slide = slidesArray[index];
      if (slide) {
        const imgData = await html2canvas(slide.nativeElement, {
          backgroundColor: 'transparent',
        }).then((canvas) => canvas.toDataURL('image/png'));

        pdf.addImage(imgData, 'PNG', 0, 0, 100, 120);

        if (index !== slidesArray.length - 1) {
          pdf.addPage();
        }
      }
    }
    const pdfBlob = pdf.output('blob');
    this.uploadFile(pdfBlob, scheduleData);
  }

  scheduleDialogOpenClose(isOpen: boolean) {
    if (isOpen) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }

  uploadFile(pdfBlob: Blob, scheduleData: any) {
    if (this.pdfUrl) {
      this.saveCarousel(scheduleData, this.pdfUrl);
    } else {
      const formData = new FormData();
      formData.append('file', pdfBlob, 'document.pdf');

      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.pdfUrl = response?.data[0]?.url;
            this.saveCarousel(scheduleData, this.pdfUrl);
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

  saveCarousel(scheduleData: any, pdfUrl: any) {
    let payload = {};

    let documentDescription = this.topic;

    if (this._utilities.selectedTheme?.slideHtml?.length > 0) {
      documentDescription = this._utilities.selectedTheme?.slideHtml[0]?.title;
    }

    let template = [];

    for (let i = 0; i < this._utilities.selectedTheme?.slideHtml?.length; i++) {
      template.push(
        this.getHtml(this._utilities.selectedTheme?.slideHtml[i], i)
      );
    }

    let carouselTemplate = template; //JSON.stringify(template);

    payload = {
      postBody: '',
      generatedType: commonConstant.POSTGENERATETYPE.CAROUSEL,
      status: commonConstant.POSTSTATUS.SCHEDULED,
      postMedia: pdfUrl,
      postMediaType: commonConstant.POSTMEDIATYPE.CAROUSEL,
      documentDescription: documentDescription?.substring(0, 40),
      carouselTemplate: carouselTemplate,
    };

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
      };
    }

    this._postService.savePost(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let advancedScheduleCredit =
            this._utilities?.userData?.plan?.advancedScheduleCredit;
          this._utilities.manageCredit(false, advancedScheduleCredit);
          this.scheduleDialogOpen = false;
          this.openConfirmPostScheduled();
          this.pdfUrl = '';
          this._toastr.success(response?.message);
        } else {
          this.scheduleDialogOpen = false;
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
        this.topic = result;
      }
    });
  }
}
