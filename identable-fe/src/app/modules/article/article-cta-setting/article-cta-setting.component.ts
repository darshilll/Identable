import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';

// COMPONENTS
import { SetBackgroundImageComponent } from '../../visual-creatives/dialog/set-background-image/set-background-image.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
@Component({
  selector: 'app-article-cta-setting',
  templateUrl: './article-cta-setting.component.html',
  styleUrls: ['./article-cta-setting.component.scss'],
})
export class ArticleCtaSettingComponent {
  @Output() _back = new EventEmitter<any>();
  @Output() _next = new EventEmitter<any>();
  @Input() cta: any;

  // Credit deducated
  creditDeducated: number = 0;
  creditMessage: any;
  selectedTabIndex: number = 0;
  ctaDetils: any = [];
  currentCtaDetails: any;
  selectLayout: any = 'DefLayout';
  bgColor: any = '';

  isInvalidCta: boolean = false;
  isInvalidCtaMessage: boolean = false;
  isInvalidCtaText: boolean = false;
  isImageMissing: boolean = false;

  // Ai genrated image
  generateImageType: any = 'ai-Image';
  generatedImage: any;

  // Credit deducated
  aiCreditDeducated: number = 0;
  aiCreditMessage: any;

  // Background image
  isCustomImage: boolean = true;
  customBgUrl: any;

  isAigenratedBgImage: boolean = false;
  aiGenratedBgUrl: any;

  // Upload image dialog
  dialogRef: any;
  isSubmit: boolean = false;
  isBrandkit: boolean = false;

  ctaMessage: any;
  ctaBtnText: any;

  layoutList: any = [
    {
      layout: 'DefLayout',
      image: 'assets/images/ai-article/cta-image-1.png',
    },
    {
      layout: 'center',
      image: 'assets/images/ai-article/cta-image-2.png',
    },
    {
      layout: 'left',
      image: 'assets/images/ai-article/cta-image-3.png',
    },
    {
      layout: 'right',
      image: 'assets/images/ai-article/cta-image-4.png',
    },
  ];

  constructor(
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService,
    private _loader: LoaderService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.articleCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;

    this.aiCreditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.aiCreditMessage = `This will cost ${this.aiCreditMessage} credits`;

    if (this._utilities.articleCTALayoutObj) {
      this.ctaDetils = this._utilities.articleCTALayoutObj;
      this.selectTab(0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cta']) {
      if (this._utilities.articleCTALayoutObj) {
        return;
      }
      for (let index = 0; index < this.cta?.length; index++) {
        this.ctaDetils.push({
          ctaBtnText: this.cta[index],
          type: 'cta',
          layout: 'DefLayout',
        });
      }
      this.ctaBtnText = this.ctaDetils[this.selectedTabIndex]?.ctaBtnText;
    }
  }

  onClickBack() {
    this._utilities.articleCTALayoutObj = this.ctaDetils;
    this._back.emit();
  }

  removeColor() {
    this.ctaDetils[this.selectedTabIndex] = {
      ...this.ctaDetils[this.selectedTabIndex],
      bgColor: '',
    };
    this.bgColor = '';
  }

  selectTab(index: any) {
    this.customBgUrl = '';
    this.aiGenratedBgUrl = '';
    this.selectedTabIndex = index;

    this.currentCtaDetails = this.ctaDetils[index];

    this.ctaBtnText = this.currentCtaDetails?.ctaBtnText
      ? this.currentCtaDetails?.ctaBtnText
      : '';
    this.ctaMessage = this.currentCtaDetails?.ctaMessage
      ? this.currentCtaDetails?.ctaMessage
      : '';
    this.selectLayout = this.currentCtaDetails?.layout
      ? this.currentCtaDetails?.layout
      : 'DefLayout';
    this.bgColor = this.currentCtaDetails?.bgColor
      ? this.currentCtaDetails?.bgColor
      : '';
    this.isBrandkit = this.currentCtaDetails?.isBrandkit
      ? this.currentCtaDetails?.isBrandkit
      : false;
    if (this.currentCtaDetails?.coverImage) {
      this.choiceBackgroundOptions(
        this.currentCtaDetails?.imageType,
        this.currentCtaDetails?.coverImage
      );
    }
  }

  onSelectLayout(layout: any) {
    this.selectLayout = layout;
    this.ctaDetils[this.selectedTabIndex] = {
      ...this.ctaDetils[this.selectedTabIndex],
      layout: layout,
    };
  }

  choiceBackgroundOptions(option: any, imageUrl?: any) {
    if (option === 'customImage') {
      this.isCustomImage = true;
      this.isAigenratedBgImage = false;
      if (imageUrl) {
        this.customBgUrl = imageUrl;
      }
    } else {
      this.isAigenratedBgImage = true;
      this.isCustomImage = false;
      if (imageUrl) {
        this.aiGenratedBgUrl = imageUrl;
      }
    }
  }

  choiceBackgroundMedia() {
    this.dialogRef = this._dialog.open(SetBackgroundImageComponent, {
      width: '960px',
      disableClose: false,
      panelClass: 'custom-create-camp-modal',
      data: { isGenrated: false },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.customBgUrl = result?.imageUrl;
      this.ctaDetils[this.selectedTabIndex] = {
        ...this.ctaDetils[this.selectedTabIndex],
        coverImage: result?.imageUrl,
        imageType: 'customImage',
      };
    });
  }

  generateImage() {
    if (this.generateImageType == 'ai-Image') {
      this.generateAiImage();
    }
  }

  generateAiImage() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);
    let payload = {};
    payload = {
      topic: '',
    };
    this._aiImage.generateAIImage(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          this.aiGenratedBgUrl = response?.data;
          this.ctaDetils[this.selectedTabIndex] = {
            ...this.ctaDetils[this.selectedTabIndex],
            coverImage: response?.data,
            imageType: 'ai-Image',
          };
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

  removeBgImage(type: any) {
    if (type === 'custom') {
      this.customBgUrl = '';
      this.ctaDetils[this.selectedTabIndex].coverImage = '';
    } else {
      this.aiGenratedBgUrl = '';
      this.ctaDetils[this.selectedTabIndex].coverImage = '';
    }
  }

  onCtaMessage(event: any) {
    this.ctaDetils[this.selectedTabIndex] = {
      ...this.ctaDetils[this.selectedTabIndex],
      ctaMessage: this.ctaMessage,
    };
  }

  generateArticle() {
    this.isInvalidCta = false;
    for (let index = 0; index < this.ctaDetils.length; index++) {
      const x = this.ctaDetils[index];
      if (!x?.ctaBtnText || !x?.ctaMessage || !x.coverImage || !x.bgColor) {
        this.selectTab(index);
        this.isInvalidCta = true;
        break;
      }
    }

    if (this.isInvalidCta) {
      return;
    }

    this._utilities.articleCTALayoutObj = this.ctaDetils;
    this._next.emit();
  }

  onColorChange(event: any) {
    const inputElement = event.target as HTMLInputElement;

    this.bgColor = inputElement.value;
    this.ctaDetils[this.selectedTabIndex] = {
      ...this.ctaDetils[this.selectedTabIndex],
      bgColor: this.bgColor,
    };
  }
}
