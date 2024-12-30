import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { take } from 'rxjs/operators';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';
import { LayoutService } from '../../../../providers/visual-creatives/ad-creative/layout/layout.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';

// COMPONENTS
import { SetBackgroundImageComponent } from '../../dialog/set-background-image/set-background-image.component';
import { CreateBrandKitAlertComponent } from '../../../../shared/dialog/create-brand-kit-alert/create-brand-kit-alert.component';

// UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-ad-creative-design-layout',
  templateUrl: './ad-creative-design-layout.component.html',
  styleUrls: ['./ad-creative-design-layout.component.scss'],
})
export class AdCreativeDesignLayoutComponent {
  @Input() creativeIdea: any;
  @Input() imageGeneratedType: any;
  @Input() contentImage: any;
  @Output() onchangeBackground = new EventEmitter<{
    type: any;
    background: any;
  }>();

  @Output() onSelectDesignLayout  = new EventEmitter<any>();
  @Output() onchangeActionBtnText = new EventEmitter();
  @Output() onChangeLogoBg        = new EventEmitter<any>();
  @Output() onLogoBgOpacity       = new EventEmitter<any>();
  @Output() onChangeLogoImage     = new EventEmitter<any>();

  currentTemplate: any;
  designLayout:any;

  // Custom button text
  actionBtnText: any = designControl?.defaultSlideBtnText;
  isActionBtn: boolean = false;

  // Logo background
  logoBackgroundColor:any;
  logoBackgroundOpacity:any;
  applyBrandKit:boolean = false;

  // Design Layout
  selectLayout: any;

  // Background image
  isCustomImage: boolean = true;
  customBgUrl: any;

  // Background gradients
  gradientsColorList: any;

  // Background color
  backgroundColorList: any;
  selectedBackgroundOption: string = 'color';

  isAigenratedBgImage: boolean = false;
  aiGenratedBgUrl: any;

  // Genrated image
  generateImageType: any = 'ai-Image';
  generatedImage: any;

  creditDeducated: number = 0;
  creditMessage: any;

  // Upload image dialog
  dialogRef: any;
  currentSettings:any;

  // Collaps settings
  isBackgroundSet: boolean = true;

  constructor(
    private _designControlService: DesignControlService,
    private _contentDesignService: ContentDesignService,
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    private _layoutService: LayoutService,
    public _utilities: CommonFunctionsService,
    private _brandkit: BrandKitService,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _aiImage: AiImageService,
    private router: Router
  ) {

    this.backgroundColorList = designControl?.listBackgroundColor;
    this.gradientsColorList = designControl?.listBackgroundGradient;

    this._contentDesignService.genratedContent$.subscribe((data) => {
      if (data?.choiceTemplatesId) {
        if (data?.genratedType === 'template') {
          this.currentTemplate = this._utilities.adCreativeTemplateArray.find(
            (t: any) => t.templateId === data?.choiceTemplatesId
          );
        }
        else {
          this.currentTemplate = this._utilities.adCreativeSaveTemplateArray.find(
            (t: any) => t._id === data?.choiceTemplatesId
          );
          this.currentTemplate = this.currentTemplate?.templateSetting;
        }

      } else {
        this.currentTemplate = this._adCreativeTemplatesService.getTemplateById(
          designControl?.defaultTemplate
        );
      }
    });     
    this.logoBackgroundColor   = this.currentTemplate?.logoBackgroundColor;
    this.logoBackgroundOpacity = this.currentTemplate?.logoBackgroundOpacity;

    // Patch the settings
    this._designControlService.templateSettings$.pipe(take(1)).subscribe((settings) => {
        console.log("Current Settings",settings);

        this.currentSettings = settings;
        this.selectLayout = settings?.layout; 
        
        this.applyBrandKit   = settings?.isBrandKit;
        if (this.applyBrandKit || settings?.islogoBrandKit) {
          const event = { target: { checked: true } }; // Mock event object to simulate the checkbox checked state
          this.switchOnBrandkit(event);
        }
    });
  }

  ngOnInit() {

    if(this.imageGeneratedType === 'Generated image')
    {
      this.isAigenratedBgImage = true;
      this.isCustomImage       = false;
      this.aiGenratedBgUrl     = this.contentImage;
    }
    else if(this.imageGeneratedType === 'Custom image')
    {
      this.isCustomImage = true;
      this.isAigenratedBgImage = false;
      this.customBgUrl   = this.contentImage;
    }

    this.designLayout = this._layoutService.getLayoutByType(this.currentTemplate);

    this.designLayout.layouts.map((obj: any) => {
      if(obj.type === this.selectLayout)
      {
        obj.isActive = true;
      }
      else
      {
        obj.isActive = false;
      }
    });
  }

  // Settings collaps

  toggleShowBackground() {
    this.isBackgroundSet = !this.isBackgroundSet;
    this.currentSettings.isBackgroundSet = this.isBackgroundSet;
    this.updateTheSetting(this.currentSettings);
  }

  selectBackgroundOption(option: string) {
    this.selectedBackgroundOption = option;
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


  // Update Layout

  selectSlideLayout(layout:any,index:any) {
    this.designLayout.layouts?.map(
      (obj: any) => obj.isActive = false
    );
    this.designLayout.layouts[index].isActive = true;
    this.onSelectDesignLayout.emit(this.designLayout.layouts[index]);
  }

  // Genrated Image

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
      topic: this.creativeIdea,
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

  // Logo Image change
  switchOnBrandkit(event:any){
    if(event.target.checked)
    {
      this.getBrandKit();
      this.applyBrandKit = true;
    }
    else
    {
      this.applyBrandKit = false;
      this.currentSettings.islogoBrandKit = false;
      this.updateTheSetting(this.currentSettings);
    }
  }

  getBrandKit() {
    let param = {};
    this._brandkit.list(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          if (!response?.data) {
            this.openBrandkitAlert();
            return;
          } 
          this.onChangeLogoImage.emit(response?.data?.logoUrl);
          this.currentSettings.islogoBrandKit = true;
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

  openBrandkitAlert() {
    this.applyBrandKit = false;
    this.dialogRef = this._dialog.open(CreateBrandKitAlertComponent, {
      width: '600px',
      disableClose: false,
      data: {},
    });
  }

  // Choice background image

  choiceBackgroundMedia() {
    this.dialogRef = this._dialog.open(SetBackgroundImageComponent, {
      width: '960px',
      disableClose: false,
      panelClass: 'custom-create-camp-modal',
      data: { isGenrated: false },
    });
    
    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.customBgUrl = result?.imageUrl;
      this.onchangeBackground.emit({
        type: 'bgImage',
        background: this.customBgUrl,
      });
    });
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

  // Change Content Image
  
  choiceBackgroundOptions(option: any) {
    if (option === 'customImage') {
      this.isCustomImage = true;
      this.isAigenratedBgImage = false;
    } else {
      this.isAigenratedBgImage = true;
      this.isCustomImage = false;
    }
  }

  // Change logo

  onColorChange(event: any) {
    const inputElement       = event.target as HTMLInputElement;
    this.logoBackgroundColor = inputElement.value;
    this.onChangeLogoBg.emit(this.logoBackgroundColor);
  }

  onLogoBgOpacityChange(event: any) {
    this.logoBackgroundOpacity = event.target.value;
    this.onLogoBgOpacity.emit(this.logoBackgroundOpacity);
  }

  // CTA Settings

  changeActionbtnText(event: any): void {
    this.isActionBtn = event.target.checked;
  }

  onAddBtnText(event: any) {
    this.onchangeActionBtnText.emit(this.actionBtnText);
  }

  updateTheSetting(setting:any){
    this._designControlService.updateTemplateSettings(setting);
  }

}
