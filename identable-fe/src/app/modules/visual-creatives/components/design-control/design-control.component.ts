import { Component, Output, Input, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// Services
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';

// COMPONENTS
import { SetBackgroundImageComponent } from '../../dialog/set-background-image/set-background-image.component';
import { SelectMediaComponent } from '../../../../shared/common/select-media/select-media.component';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-design-control',
  templateUrl: './design-control.component.html',
  styleUrls: ['./design-control.component.scss'],
})
export class DesignControlComponent {
  @Input() carouselIdea: any;
  @Output() onpatternOpacity = new EventEmitter();
  @Output() onselectPattern = new EventEmitter();
  @Output() onselectQRvisible = new EventEmitter<{
    isQRvisible: boolean;
    QRtext: any;
  }>();
  @Output() onchangeActionBtnText = new EventEmitter();

  @Output() onchangeBackground = new EventEmitter<{
    type: any;
    background: any;
  }>();
  @Output() onchangeBackgroundOpacity = new EventEmitter();
  
  @Output() onChangeSwipeIndicator = new EventEmitter<{
    isSwipeBtnText: any;
    isSwipeBtnvisible: boolean;
  }>();

  @Output() onchangeBookmarkIndicator = new EventEmitter();

  // Background color
  backgroundColorList: any;
  selectedBackgroundOption: string = 'color';

  // Design Layout
  selectLayout: any = 'left';
  patternOpacity: number = 50;
  patternDesign: any = 'none';

  // Background gradients
  gradientsColorList: any;

  // Background image
  isCustomImage: boolean = true;
  customBgUrl: any;

  isAigenratedBgImage: boolean = false;
  aiGenratedBgUrl: any;

  backgroundPattern: any = [
    'assets/images/carousels-v2/bg-pattern-2.png',
    'assets/images/carousels-v2/bg-pattern-3.png',
    'assets/images/carousels-v2/bg-pattern-4.png',
    'assets/images/carousels-v2/bg-pattern-5.png',
    'assets/images/carousels-v2/bg-pattern-6.png',
  ];

  layoutOptions: any = [
    {
      layout: 'left',
      image: 'assets/images/carousels-v2/layout-option-1.svg',
    },
    {
      layout: 'center',
      image: 'assets/images/carousels-v2/layout-option-2.svg',
    },
    {
      layout: 'right',
      image: 'assets/images/carousels-v2/layout-option-3.svg',
    },
    {
      layout: 'upparCenter',
      image: 'assets/images/carousels-v2/layout-option-4.svg',
    },
    {
      layout: 'upparLeft',
      image: 'assets/images/carousels-v2/layout-option-5.svg',
    },
    {
      layout: 'upparRight',
      image: 'assets/images/carousels-v2/layout-option-6.svg',
    },
  ];

  // Add QR
  isAddQrVisible: boolean = false;
  QRtext: any;
  isGenrated: boolean = false;

  // Custom button text
  actionBtnText: any = designControl?.defaultSlideBtnText;
  isActionBtn: boolean = false;

  // Swipe Btn setting
  swipeBtnAllText: string[] = designControl?.randomSwipeBtnText;
  swipeBtnIndex: any = 0;

  isSwipeBtnText: any = this.swipeBtnAllText[0];
  isSwipeBtnvisible: boolean = false;
  isBookMarkvisible: boolean = false;

  // Collaps settings
  isBackgroundSet: boolean = true;
  isBackgroundPattern: boolean = false;
  isCTASettings: boolean = false;
  isSwipeSettings: boolean = false;

  // Upload image dialog
  dialogRef: any;

  generateImageType: any = 'ai-Image';
  generatedImage: any;
  creditDeducated: number = 0;
  creditMessage: any;

  // Current Template Settings
  currentSettings:any;
  constructor(
    private _designControlService: DesignControlService,
    private _toastr: ToastrService,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService,
    private _loader: LoaderService,
    public _aiImage: AiImageService
  ) {
    this.backgroundColorList = designControl?.listBackgroundColor;
    this.gradientsColorList = designControl?.listBackgroundGradient;

    // Patch the settings
    this._designControlService.templateSettings$.pipe(take(1)).subscribe((settings) => {

      console.log("settings->>",settings);
      
      this.currentSettings = settings;

      this.selectLayout   = settings?.layout;
      this.patternDesign  = settings?.bgPattern;
      this.patternOpacity = settings?.bgPatternOpacity;

      // Background options
      this.isAigenratedBgImage = settings?.aiGenratedBgUrl;
      this.isCustomImage       = settings?.isBgImage;
      this.customBgUrl         = settings?.isBgImage ? settings?.backgroundImage : '';
      this.aiGenratedBgUrl     = settings?.aiGenratedBgUrl
        ? settings?.backgroundImage
        : '';
      
      // Update the collaps setting
      this.isBackgroundPattern = settings?.isBackgroundPattern;
      this.isBackgroundSet     = settings?.isBackgroundSet;
      this.isCTASettings       = settings?.isCTASettings;
      this.isSwipeSettings     = settings?.isSwipeSettings;

      // Swipe Settings
      this.isSwipeBtnvisible   = settings?.isSwipeBtnvisible;
    });
  }

  ngOnInit(): void {
    this.creditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  selectBackgroundOption(option: string) {
    this.selectedBackgroundOption = option;
  }

  removeBgImage(type: any) {
    if (type === 'custom') {
      this.customBgUrl = '';
      this.onchangeBackground.emit({
        type: 'bgImage',
        background: this.customBgUrl,
      });
    }
    else
    {
      this.aiGenratedBgUrl = '';
      this.onchangeBackground.emit({
        type: 'bgImage',
        background: this.aiGenratedBgUrl     
      });
    }
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

  choiceBackgroundMedia() {
    this.dialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      disableClose: false,
      data: { },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.customBgUrl = result?.url;
      this.onchangeBackground.emit({
        type: 'bgImage',
        background: this.customBgUrl,
      });
    });
  }

  changeBgImageOpacity(event: any) {
    this.onchangeBackgroundOpacity.emit(event.target.value);   
  }

  // update background color settings

  selectBackgroundColor(color: string) {
    this.onchangeBackground.emit({
      type: 'bgColor',
      background: color,
    });
  }

  onChangeBgColor(event: any){
    const inputElement = event.target as HTMLInputElement;
    this.onchangeBackground.emit({
      type: 'bgColor',
      background: inputElement.value,
    });
  }

  // update background gradient settings
  selectBackgroundGradient(gradient: string) {
    this.customBgUrl = '';
    this.aiGenratedBgUrl = '';
    this.onchangeBackground.emit({
      type: 'bgGradient',
      background: gradient,
    });
  }

  // Update the layout
  selectSlideLayout(layout: string) {
    this.selectLayout = layout;

    this.currentSettings.layout = layout;
    this.updateTheSetting(this.currentSettings);
    this._designControlService.updateSlideLayout(layout);
  }

  onPatternOpacityChange(event: any) {
    this.patternOpacity = event.target.value;
    this.currentSettings.bgPatternOpacity = this.patternOpacity;
    this.updateTheSetting(this.currentSettings);
    this.onpatternOpacity.emit(this.patternOpacity);
  }

  onSelectPattern(data: any) {
    this.patternDesign = data;
    this.currentSettings.bgPattern = data;
    this.updateTheSetting(this.currentSettings);
    this.onselectPattern.emit(data);
  }

  // Settings collaps

  toggleShowBackground() {
    this.isBackgroundSet = !this.isBackgroundSet;
    this.currentSettings.isBackgroundSet = this.isBackgroundSet;
    this.updateTheSetting(this.currentSettings);
  }

  toggleShowPattern() {
    this.isBackgroundPattern = !this.isBackgroundPattern;
    this.currentSettings.isBackgroundPattern = this.isBackgroundPattern;
    this.updateTheSetting(this.currentSettings);
  }

  toggleCTAsetting() {
    this.isCTASettings = !this.isCTASettings;
    this.currentSettings.isCTASettings = this.isCTASettings;
    this.updateTheSetting(this.currentSettings);
  }

  toggleSwipeSettings() {
    this.isSwipeSettings = !this.isSwipeSettings;
    this.currentSettings.isSwipeSettings = this.isSwipeSettings;
    this.updateTheSetting(this.currentSettings);
  }

  // QR Setting

  addQrVisible(event: any): void {
    if (event.target.checked) {
      this.isAddQrVisible = event.target.checked;
    } else {
      this.isAddQrVisible = event.target.checked;
      this.QRtext = '';
      this.isGenrated = false;

      this.onselectQRvisible.emit({
        isQRvisible: this.isAddQrVisible,
        QRtext: this.QRtext,
      });
    }
  }

  genratedQR() {
    if (!this.QRtext) {
      this._toastr.error('Please enter text.');
      return;
    }
    this.isGenrated = true;
    this.QRtext = this.QRtext;

    this.onselectQRvisible.emit({
      isQRvisible: this.isAddQrVisible,
      QRtext: this.QRtext,
    });
  }

  changeActionbtnText(event: any): void {
    this.isActionBtn = event.target.checked;
  }

  onAddBtnText(event: any) {
    this.onchangeActionBtnText.emit(this.actionBtnText);
  }

  changeSwipebtnIndicator(event: any) {
    this.isSwipeBtnvisible = event.target.checked;

    this.onChangeSwipeIndicator.emit({
      isSwipeBtnText: this.isSwipeBtnText,
      isSwipeBtnvisible: this.isSwipeBtnvisible,
    });
  }

  changeBookmarkIndicator(event: any) {
    this.isBookMarkvisible = event.target.checked;
    this.onchangeBookmarkIndicator.emit(this.isBookMarkvisible);
  }

  changeSwipebtnText() {
    this.swipeBtnIndex = (this.swipeBtnIndex + 1) % this.swipeBtnAllText.length;
    this.isSwipeBtnText = this.swipeBtnAllText[this.swipeBtnIndex];
    this.onChangeSwipeIndicator.emit({
      isSwipeBtnText: this.isSwipeBtnText,
      isSwipeBtnvisible: this.isSwipeBtnvisible,
    });
  }

  onAddSwipeBtnText(event: any) {
    this.onChangeSwipeIndicator.emit({
      isSwipeBtnText: this.isSwipeBtnText,
      isSwipeBtnvisible: this.isSwipeBtnvisible,
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
      topic: this.carouselIdea,
    };
    this._aiImage.generateAIImage(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          this.aiGenratedBgUrl = response?.data;
          this.onchangeBackground.emit({
            type: 'bgImage',
            background: this.aiGenratedBgUrl,
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

  updateTheSetting(setting:any){
    this._designControlService.updateTemplateSettings(setting);
  }
}
