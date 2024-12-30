import { Component, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

// SERVICES
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//Component
import { CreateBrandKitAlertComponent } from '../../../../shared/dialog/create-brand-kit-alert/create-brand-kit-alert.component';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-text-setting',
  templateUrl: './text-setting.component.html',
  styleUrls: ['./text-setting.component.scss'],
})
export class TextSettingComponent {
  @Output() changeFontPair = new EventEmitter<any>();
  @Output() changeTitleFont = new EventEmitter<any>();
  @Output() changeDescriptionFont = new EventEmitter<any>();
  @Output() changeTitleFontSize = new EventEmitter<any>();
  @Output() changeDescriptionFontSize = new EventEmitter<any>();

  currentTemplate: any;

  selectedTitleFontSize: any = '44px';
  selectedDescriptionFontSize: any = '16px';

  fontFamilyList: any;
  pairFontFamilyList: any;

  // font put
  isPairFont: boolean = false;
  fontPair: any;
  titlefont: any;
  descriptionFont: any;

  applyBrandKit: boolean = false;
  dialogRef: any;

  currentSettings:any;
  constructor( 
    private _dialog: MatDialog,
    private carouselTemplatesService: CarouselTemplatesService,
    private _designControlService: DesignControlService,
    private _brandkit: BrandKitService,
    private _toastr: ToastrService
  ) {
    // Patch the settings
    this._designControlService.templateSettings$.pipe(take(1)).subscribe((settings) => {
      console.log("settings",settings);
      this.currentSettings = settings;

      this.isPairFont = settings?.pairFont;
      this.fontPair   = settings?.fontPair;
      this.titlefont  = settings?.titlefont;
      this.descriptionFont = settings?.descriptionFont;
      this.selectedTitleFontSize = settings?.titlefontSize;
      this.selectedDescriptionFontSize = settings?.descriptionFontSize;

      this.applyBrandKit = settings?.isBrandKit;
      if (this.applyBrandKit || settings?.isTextBrandKit) {
        const event = { target: { checked: true } }; // Mock event object to simulate the checkbox checked state
        this.switchOnBrandkit(event);
      }
    });

    this.fontFamilyList = designControl?.fontFamilyList;
    this.pairFontFamilyList = designControl?.PairFontFamilyList;
  }

  switchOnBrandkit(event: any) {
    this.applyBrandKit = event.target.checked;
    if (event.target.checked) {
      this.getBrandKit();
    } else {
      this.changeTitleFont.emit(this.titlefont);
      this.changeDescriptionFont.emit(this.descriptionFont);      
    } 
    this.currentSettings.isTextBrandKit = event.target.checked;
    this.updateTheSetting(this.currentSettings); 
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

          this.titlefont = response?.data?.titleFont;
          this.descriptionFont = response?.data?.bodyFont;

          this.changeTitleFont.emit(this.titlefont);
          this.changeDescriptionFont.emit(this.descriptionFont);
          this.applyBrandKit = true;
          this.isPairFont = false;
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

  switchOffFontPair(event: any) {
    if (event.target.checked) {
      this.isPairFont = event.target.checked;
    } else {
      this.isPairFont = event.target.checked;
    }
    this.currentSettings.pairFont = event.target.checked;
  }

  onChangeFontPair(event: any) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];

    const fontOne = selectedOption.getAttribute('data-fontOne');
    const fontTwo = selectedOption.getAttribute('data-fontTwo');

    this.changeFontPair.emit(event.target.value);
    this.changeTitleFont.emit(fontOne);
    this.changeDescriptionFont.emit(fontTwo);

    this.titlefont = fontOne;
    this.descriptionFont = fontTwo;

    this.currentSettings.titlefont = fontOne;
    this.currentSettings.descriptionFont = fontTwo;
    this.updateTheSetting(this.currentSettings);
  }

  onChangeTitleFont(event: any) {
    this.currentSettings.titlefont = event.target.value;
    this.changeTitleFont.emit(event.target.value);
    this.updateTheSetting(this.currentSettings);
  }

  onChangeDescriptionFont(event: any) {
    this.currentSettings.descriptionFont = event.target.value;
    this.changeDescriptionFont.emit(event.target.value);
    this.updateTheSetting(this.currentSettings);
  }

  selectTitleFontSize(value: any, size: any) {
    this.selectedTitleFontSize = size;
    this.currentSettings.titlefontSize = size;
    this.changeTitleFontSize.emit(size);
    this.updateTheSetting(this.currentSettings);
  }

  selectDescriptionFontSize(value: any, size: any) {
    this.selectedDescriptionFontSize = size;
    this.currentSettings.descriptionFontSize = size;
    this.changeDescriptionFontSize.emit(size);
    this.updateTheSetting(this.currentSettings);
  }

  updateTheSetting(setting:any){
    this._designControlService.updateTemplateSettings(setting);
  }
}
