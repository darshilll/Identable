import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ElementRef, ViewChild } from '@angular/core';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';
import { PostService } from '../../../providers/post/post.service';
import { UserService } from '../../../providers/user/user.service';
import { GeneralService } from 'src/app/providers/general/general.service';

// COMPONENTS
import { AddCustomCarouselThemeComponent } from '../../../shared/dialog/add-custom-carousel-theme/add-custom-carousel-theme.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { GlobalService } from '../../../utils/common-functions/global.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @ViewChild('htmlContent', { static: false }) htmlContent!: ElementRef;
  base64Img: any;

  topic: any;
  selectedTheme: any;
  isSignatureAlign: boolean = true;
  isSubmited: boolean = false;
  carouselTheme: any = [];
  currentProfile: any;
  carouselLength: number = 3;
  dialogRef: any;
  scheduleDialogOpen: boolean = false;
  isAddThemeAllow: boolean = false;
  isCarouselCredit: number = 10;
  isAddThemeCredit: number = 0;
  isSelectedPromtTheme: string = '';
  promtTheme: any;

  dumyTopic: string = 'Lorem ipsum dolor sit amt is consectet?';
  dumyPost: string = `Lorem ipsum dolor sit amet consectetur. Odio sed dignissim cum a ultrices tempor praesent. Egestas commodo at semper non
  ridiculus orci suspendisse. Id urna ut ante magnis nam commodo
  nisi. Massa purus vel in quis aliquet purus leo feugiat eget.
  Habitasse blandit dapibus in`;

  slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    nav: true,
  };

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    outline: false,
    toolbarPosition: 'bottom',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'subscript', 'superscript', 'indent', 'outdent'],
      [
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  customSliderDataForm: FormGroup;
  carousel: any;

  constructor(
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _Carousel: CarouselService,
    private _post: PostService,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _titleService: Title,
    public _utilities: CommonFunctionsService,
    private _userService: UserService,
    public _generalService: GeneralService,
    public _globalService: GlobalService
  ) {
    this._titleService.setTitle('Identable | Carousel');

    this.customSliderDataForm = this.formBuilder.group({
      customTopic: ['', Validators.required],
      customPost: [''],
    });

    this.promtTheme = commonConstant.caruselPromtTheme;
  }

  ngOnInit(): void {
    this.initView();
    this.getCarouselTheme();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.setCurrentProfileData();
  }

  async setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );

    const data = await fetch(this.currentProfile?.image);
    const blob = await data.blob();

    var vm = this;
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      var base64data = reader.result;
      vm.base64Img = base64data;
    };
  }

  getCarouselTheme() {
    this._loader.stop();
    this._Carousel.getTheme({}).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.carouselTheme = response?.data;
          if (this.carouselTheme[0]) {
            this.selectedTheme = this.carouselTheme[0];
            this.isSignatureAlign =
              this.selectedTheme?.signatureAlign == 'left' ? true : false;
          }
          this._loader.stop();
        } else {
          this._loader.stop();
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

  selectPromtTheme(theme: any) {
    this.isSelectedPromtTheme = theme;
  }

  addSlide(index: any) {
    this.carousel.splice(index, 0, {
      isCustomSlide: true,
      isSave: false,
      customTopic: this.dumyTopic,
      customPost: this.dumyPost,
    });
  }

  removeSlide(index: any) {
    this.carousel.splice(index, 1);
  }

  editSlide(index: any) {
    this.carousel[index] = {
      ...this.carousel[index],
      isCustomSlide: true,
      isSave: false,
    };

    this.customSliderDataForm.patchValue({
      customTopic: this.carousel[index].title,
      customPost: this.carousel[index].content,
    });
  }

  formatString(string: string) {
    return string.replace(/\n/g, '<br/>');
  }

  saveSlide(index: any) {
    let formData = this.customSliderDataForm.getRawValue();
    this.carousel[index].isCustomSlide = false;
    this.carousel[index].isSave = true;
    this.carousel[index].title = formData?.customTopic;
    this.carousel[index].content = formData?.customPost;
    if (this.isSignatureAlign) {
      this.carousel[index].nameIcon = false;
    }
    this.customSliderDataForm.reset();
  }

  generateCarousel() {
    this.isSubmited = true;
    if (!this.topic || !this.isSelectedPromtTheme) {
      return;
    }
    // this._loader.loaderMessage = `Of course! 😊 <span class="gptModel">GPT-${this._utilities?.chatGPTModel}</span> is in action 🤖💼. <br />Awaiting the AI magic ✨🔮, just hang tight, please! 🕒🤗`;
    this._loader.start();

    let obj = {
      length: this.carouselLength,
      topic: this.topic,
      promtTheme: this.isSelectedPromtTheme,
    };

    this._Carousel.generateCarousel(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.carousel = response?.data;
          this._loader.stop();
        } else {
          this.carousel = [];
          this._loader.stop();
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

  removeEmojis(text: string) {
    // Regular expression to match emojis
    var emojiPattern =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

    // Replace emojis with an empty string
    return text.replace(emojiPattern, '');
  }

  async generatePDF(scheduleData: any) {
    if (!this.carousel) {
      return;
    }
    const userName = this.currentProfile?.name || '';

    const imageDataUrl = await this.createImage();

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [200, 200],
    });

    let backgroundColor = this.selectedTheme?.backgroundColor
      ? this.selectedTheme?.backgroundColor
      : '';
    let backgroundMedia = this.selectedTheme?.backgroundMedia
      ? this.selectedTheme?.backgroundMedia
      : '';

    // Set page number
    const pageCount = this.carousel.length;
    let yOffset = 10;
    console.log('this.selectedTheme = ', this.selectedTheme);
    for (let i = 0; i < pageCount; i++) {
      let context = this.carousel[i];

      if (backgroundColor) {
        // Set the background color
        doc.setFillColor(backgroundColor);
        doc.rect(
          0,
          0,
          doc.internal.pageSize.getWidth(),
          doc.internal.pageSize.getHeight(),
          'F'
        );
      }

      // ============== Title ===================

      const title = this.removeEmojis(context?.title || '');
      const titleFont = 20;
      const titleBackgroundColor = '#8759b2';

      const titleHeight = doc.getTextDimensions(title, {
        fontSize: titleFont,
        maxWidth: doc.internal.pageSize.getWidth() - 40,
      }).h;

      doc.setFillColor(titleBackgroundColor);
      doc.rect(
        10,
        10,
        doc.internal.pageSize.getWidth() - 20,
        titleHeight + 10,
        'F'
      );

      doc.setFontSize(titleFont);
      doc.setTextColor(
        this.selectedTheme?.fontColor
          ? this.selectedTheme?.fontColor
          : '#777777'
      );
      doc.text(title, 20, yOffset + 10, {
        maxWidth: doc.internal.pageSize.getWidth() - 40,
      });

      yOffset += 20;

      yOffset += titleHeight;
      yOffset += 5;

      // ============== Content ===================

      const content = this.removeEmojis(context?.content || '');
      const contentFont = 16;
      const contentBackgroundColor = '#8759b2';

      const contentHeight = doc.getTextDimensions(content, {
        fontSize: contentFont,
        maxWidth: doc.internal.pageSize.getWidth() - 20,
      }).h;

      doc.setFillColor(contentBackgroundColor);
      doc.rect(
        10,
        yOffset,
        doc.internal.pageSize.getWidth() - 20,
        contentHeight + 10,
        'F'
      );

      doc.setFontSize(contentFont);
      doc.text(content, 20, yOffset + 10, {
        maxWidth: doc.internal.pageSize.getWidth() - 40,
      });

      yOffset += contentHeight;
      yOffset += 20;

      // ============== Bottom ===================

      let alignment = this.selectedTheme?.signatureAlign;

      const imageSize = 10; // Adjust the image size as needed
      const nameFontSize = 14; // Adjust the font size for the name

      yOffset += 5;

      doc.setTextColor('#fff');

      if (alignment === 'left') {
        doc.addImage(
          imageDataUrl,
          'JPEG',
          10,
          doc.internal.pageSize.getHeight() - 10 - imageSize,
          imageSize,
          imageSize
        );
        doc.setFontSize(nameFontSize);
        doc.text(
          userName,
          10 + imageSize + 5,
          doc.internal.pageSize.getHeight() - 10 - imageSize + 2 + imageSize / 2
        );
      } else if (alignment === 'center') {
        const centerX = (doc.internal.pageSize.getWidth() - imageSize) / 2;
        doc.addImage(
          imageDataUrl,
          'JPEG',
          centerX,
          doc.internal.pageSize.getHeight() - 10 - imageSize,
          imageSize,
          imageSize
        );
        doc.setFontSize(nameFontSize);
        doc.text(
          userName,
          centerX + imageSize / 2 + 5,
          doc.internal.pageSize.getHeight() - 10 - imageSize + 2 + imageSize / 2
        );
      } else if (alignment === 'right') {
        const rightX = doc.internal.pageSize.getWidth() - 10 - imageSize;
        doc.addImage(
          imageDataUrl,
          'JPEG',
          rightX,
          doc.internal.pageSize.getHeight() - 10 - imageSize,
          imageSize,
          imageSize
        );
        doc.setFontSize(nameFontSize);
        doc.text(
          userName,
          rightX - 14 - imageSize * 2,
          doc.internal.pageSize.getHeight() - 10 - imageSize + 2 + imageSize / 2
        );
      }

      // yOffset += Math.max(imageSize + 20, contentHeight + 20); // Adjust vertical position for the next page

      // Add the image to the PDF
      // doc.addImage(imageDataUrl, 'JPEG', 10, yOffset, 30, 30);

      yOffset += Math.max(30 + 20, contentHeight + 20); // Adjust vertical position for the next page

      if (i < pageCount - 1) {
        doc.addPage();
        yOffset = 10;
      }
    }

    const pdfBlob = doc.output('blob');
    this.uploadFile(pdfBlob, scheduleData);

    // doc.save('carousel.pdf');
  }

  async createImage() {
    const content = this.htmlContent.nativeElement;
    const imageDataUrl = await html2canvas(content, {
      backgroundColor: 'transparent',
    }).then((canvas) => canvas.toDataURL('image/png'));
    return imageDataUrl;
  }

  saveCarousel(scheduleData: any, pdfUrl: any) {
    this._loader.start();

    let payload = {};
    payload = {
      postBody: ' ',
      generatedType: commonConstant.POSTGENERATETYPE.CAROUSEL,
      status: commonConstant.POSTSTATUS.SCHEDULED,
      postMedia: pdfUrl,
      postMediaType: commonConstant.POSTMEDIATYPE.CAROUSEL,
    };

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
      };
    }

    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.scheduleDialogOpen = false;
          this.carousel = [];
          this.openConfirmPostScheduled();
          this._toastr.success(response?.message);
          this._loader.stop();
        } else {
          this.scheduleDialogOpen = false;
          this.carousel = [];
          this._loader.stop();
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

  openAddCustomCarouselDialog() {
    this.dialogRef = this._dialog.open(AddCustomCarouselThemeComponent, {
      width: '720px',
      panelClass: 'custom-edit-post-modal',
      data: { currentProfile: this.currentProfile },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.isAddTheme) {
        this.getCarouselTheme();
      }
    });
  }

  scheduleDialogOpenClose(isOpen: boolean) {
    if (isOpen) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  selectTheme(theme: any) {
    this.selectedTheme = theme;
    this.isSignatureAlign =
      this.selectedTheme?.signatureAlign == 'left' ? true : false;
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

  deleteTheme(id: any) {
    this._loader.start();
    this._Carousel.deleteTheme(id).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._loader.stop();
          this.getCarouselTheme();
          this._toastr.success(response?.message);
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

  signatureAlign(align: boolean) {
    if (align) {
      this.isSignatureAlign = true;
    } else {
      this.isSignatureAlign = false;
    }
  }

  uploadFile(pdfBlob: Blob, scheduleData: any) {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    this._generalService.uploadFile(formData).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          let pdfUrl = response?.data[0]?.url;
          this.saveCarousel(scheduleData, pdfUrl);
        } else {
          return response?.data[0]?.url;
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

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }
}
