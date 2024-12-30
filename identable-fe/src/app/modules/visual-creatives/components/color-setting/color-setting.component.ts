import { Component, Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//Component
import { CreateBrandKitAlertComponent } from '../../../../shared/dialog/create-brand-kit-alert/create-brand-kit-alert.component';

// Services
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-color-setting',
  templateUrl: './color-setting.component.html',
  styleUrls: ['./color-setting.component.scss']
})
export class ColorSettingComponent {

  @Output() changeColorSetting = new EventEmitter<{ backgroundColor: any, textColor: any, subColor: any, subBackgroundColor: any }>();

  selectTextcolor: any;

  backgroundColor:any;
  subBackgroundColor:any;
  subColor:any;
  textColor:any;

  colorThemes:any;

  applyBrandKit:boolean = false;
  dialogRef: any;
  currentSettings:any;
  constructor(
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    private _designControlService: DesignControlService,
    private _brandkit: BrandKitService,
  ) {

    this.colorThemes = designControl?.colorThemes;

    // Patch the settings
    this._designControlService.templateSettings$.pipe(take(1)).subscribe((settings) => {
      this.currentSettings    = settings;

      this.backgroundColor    = settings?.backgroundColor;
      this.subBackgroundColor = settings?.subBackgroundColor;
      this.subColor  = settings?.subColor;
      this.textColor = settings?.textColor;

      this.applyBrandKit      = settings?.isBrandKit;
      if (this.applyBrandKit || settings?.isColorBrandKit) {
        const event = { target: { checked: true } }; // Mock event object to simulate the checkbox checked state
        this.switchOnBrandkit(event);
      }
    });

  }

  switchOnBrandkit(event:any){
    this.applyBrandKit = event.target.checked;
    if(event.target.checked)
    {
      this.getBrandKit();      
    }
    else
    {
      this.onChangeEmitColors();
    }   
    this.currentSettings.isColorBrandKit = event.target.checked;
    this.updateTheSetting(this.currentSettings); 
  }
  
  getBrandKit() {
    let param = {};
    this._brandkit.list(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {

          if(!response?.data)
          {
            this.openBrandkitAlert();
            return;
          }

          this.backgroundColor    = response?.data?.primaryColor;
          this.subBackgroundColor = response?.data?.accent2Color,
          this.subColor  = response?.data?.accent1Color, 
          this.textColor = response?.data?.secondaryColor, 

          this.changeColorSetting.emit({ 
            backgroundColor: response?.data?.primaryColor, 
            textColor: response?.data?.secondaryColor, 
            subColor: response?.data?.accent1Color, 
            subBackgroundColor: response?.data?.accent2Color,
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

  openBrandkitAlert(){
    this.applyBrandKit = false;
    this.dialogRef = this._dialog.open(CreateBrandKitAlertComponent, {
      width: '600px',
      disableClose: false,
      data: {},
    });
  }

  onColorChange(event: any, type: any) {
    const inputElement = event.target as HTMLInputElement;

    if (type == 'backgroundColor') {
      this.backgroundColor = inputElement.value;
    } else if (type == 'textColor') {
      this.textColor = inputElement.value;
    } else if (type == 'subColor') {
      this.subColor = inputElement.value;
    } else if (type == 'subBackgroundColor') {
      this.subBackgroundColor = inputElement.value;
    }
    
    this.currentSettings.backgroundColor = this.backgroundColor;
    this.currentSettings.subBackgroundColor = this.subBackgroundColor;
    this.currentSettings.subColor = this.subColor;
    this.currentSettings.textColor = this.textColor;
    this.onChangeEmitColors();
    this.updateTheSetting(this.currentSettings);
  }

  onChangeEmitColors(){
    this.changeColorSetting.emit({ 
      backgroundColor:this.backgroundColor, 
      textColor:this.textColor, 
      subColor:this.subColor, 
      subBackgroundColor: this.subBackgroundColor 
    });
  }

  toggleColorSetting(backgroundColor: any, textColor: any, subColor: any, subBackgroundColor: any): void {
    this.backgroundColor    = backgroundColor;
    this.textColor = textColor;
    this.subColor  = subColor;
    this.subBackgroundColor = subBackgroundColor;   
    
    this.changeColorSetting.emit({ backgroundColor, textColor, subColor, subBackgroundColor });  // Emit the event with slide and index to parent component
  }

  updateTheSetting(setting:any){
    this._designControlService.updateTemplateSettings(setting);
  }

}
