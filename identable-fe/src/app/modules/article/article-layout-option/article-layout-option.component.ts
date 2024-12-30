import { Component, Input, Output, EventEmitter } from '@angular/core';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// Services
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { BrandKitService } from 'src/app/providers/brandkit/brand-kit.service';

// COMPONENTS
import { SetBackgroundImageComponent } from '../../visual-creatives/dialog/set-background-image/set-background-image.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-article-layout-option',
  templateUrl: './article-layout-option.component.html',
  styleUrls: ['./article-layout-option.component.scss'],
})
export class ArticleLayoutOptionComponent {
  @Input() isCTA: boolean = false;
  @Output() _back = new EventEmitter<any>();
  @Output() _next = new EventEmitter<any>();
  // Design Layout
  selectLayout: any = 'center';
  headline: any;
  isBrandkit: boolean = false;
  brandkitSeting: any;
  articleLayout: any = [
    {
      layout: 'center',
      image: 'assets/images/ai-article/cover-image-1.png',
    },
    {
      layout: 'left',
      image: 'assets/images/ai-article/cover-image-2.png',
    },
    {
      layout: 'right',
      image: 'assets/images/ai-article/cover-image-3.png',
    },
  ];

  // Ai genrated image
  generateImageType: any = 'ai-Image';
  generatedImage: any;

  // Credit deducated
  creditDeducated: number = 0;
  creditMessage: any;
  aiCreditDeducated: number = 0;
  aiCreditMessage: any;

  // Background image
  isCustomImage: boolean = true;
  customBgUrl: any;

  isAigenratedBgImage: boolean = false;
  aiGenratedBgUrl: any;
  logoUrl: any;
  primaryColor: any = '';
  overlayColor: any;

  // Upload image dialog
  dialogRef: any;
  isSubmit: boolean = false;
  imageStyles = [
    {
      value: 'ai-Image',
      label: 'AI Image',
      icon: 'assets/images/ai-icon.svg',
    },
    {
      value: 'pexel-image',
      label: 'Pexel Image',
      icon: 'assets/images/pixels-icon.png',
    },
  ];
  constructor(
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService,
    private _loader: LoaderService,
    private _brandkit: BrandKitService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.articleCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;

    this.aiCreditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.aiCreditMessage = `This will cost ${this.aiCreditMessage} credits`;

    let layoutData = this._utilities.articleObject?.bannerImageSetting;
    if (layoutData) {
      this.selectLayout = layoutData?.layout ? layoutData?.layout : 'center';
      this.primaryColor = layoutData?.bgColor;
      this.overlayColor = layoutData?.overlayColor;
      this.headline = layoutData?.headline;
      this.isBrandkit = layoutData?.isBrandkit ? layoutData?.isBrandkit : false;
      if (layoutData?.isCustomImage) {
        this.customBgUrl = layoutData?.coverImage;
      }
      if (layoutData?.isAigenratedBgImage) {
        this.aiGenratedBgUrl = layoutData?.coverImage;
      }
    }
  }

  onSelectLayout(layout: any) {
    this.selectLayout = layout;
  }

  choiceBackgroundOptions(option: any) {
    if (option === 'customImage') {
      this.isCustomImage = true;
      this.isAigenratedBgImage = false;
    } else {
      this.isAigenratedBgImage = true;
      this.isCustomImage = false;
    }
  }

  removeColor(type: any) {
    if (type === 'primaryColor') {
      this.primaryColor = '';
    }

    if (type === 'overlayColor') {
      this.overlayColor = '';
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
    } else {
      this.aiGenratedBgUrl = '';
    }
  }

  onClickBack() {
    let currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
    let coverImage = '';
    let profileAvatar = currentProfile?.image
      ? currentProfile?.image
      : 'assets/images/avatar/avatar.png';
    if (this.isBrandkit) {
      profileAvatar = this.logoUrl;
    }
    if (this.isCustomImage) {
      coverImage = this.customBgUrl;
    }
    if (this.isAigenratedBgImage) {
      coverImage = this.aiGenratedBgUrl;
    }

    this._utilities.articleObject.bannerImageSetting = {
      layout: this.selectLayout,
      coverImage: coverImage,
      headline: this.headline,
      profileAvatar: profileAvatar,
      bgColor: this.primaryColor,
      overlayColor: this.overlayColor,
      isAiImage: this.isAigenratedBgImage,
      isCustomImage: this.isCustomImage,
      isBrandkit: this.isBrandkit,
    };
    this._back.emit();
  }

  onClickNext() {
    this.isSubmit = true;
    if (
      !this.headline ||
      !this.primaryColor ||
      (!this.aiGenratedBgUrl && !this.customBgUrl)
    ) {
      return;
    }
    let currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
    let coverImage = '';
    let profileAvatar = currentProfile?.image
      ? currentProfile?.image
      : 'assets/images/avatar/avatar.png';
    if (this.isBrandkit) {
      profileAvatar = this.logoUrl;
    }

    if (this.isCustomImage) {
      coverImage = this.customBgUrl;
    }
    if (this.isAigenratedBgImage) {
      coverImage = this.aiGenratedBgUrl;
    }

    this._utilities.articleObject.bannerImageSetting = {
      layout: this.selectLayout,
      coverImage: coverImage,
      headline: this.headline,
      profileAvatar: profileAvatar,
      bgColor: this.primaryColor,
      overlayColor: this.overlayColor,
      isAiImage: this.isAigenratedBgImage,
      isCustomImage: this.isCustomImage,
      isBrandkit: this.isBrandkit,
    };
    this._next.emit();
  }

  selectBrandkit(event: any) {
    let isChecked = event.target.checked;
    if (this.brandkitSeting) {
      this.logoUrl = this.brandkitSeting?.logoUrl;
      this.primaryColor = this.brandkitSeting?.primaryColor;
    }
    if (isChecked && !this.brandkitSeting) {
      this.getBrandKit();
    }
  }

  getBrandKit() {
    this._loader.start();
    this._brandkit.list({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.brandkitSeting = response?.data;
          if (this.brandkitSeting) {
            this.logoUrl = this.brandkitSeting?.logoUrl;
            this.primaryColor = this.brandkitSeting?.primaryColor;
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

  onColorChange(event: any, type: any) {
    const inputElement = event.target as HTMLInputElement;

    if (type == 'primaryColor') {
      this.primaryColor = inputElement.value;
    } else if (type == 'overlayColor') {
      this.overlayColor = inputElement.value;
    }
  }
}
