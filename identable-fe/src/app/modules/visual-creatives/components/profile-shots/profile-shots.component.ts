import { Component,Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//Component
import { CreateBrandKitAlertComponent } from '../../../../shared/dialog/create-brand-kit-alert/create-brand-kit-alert.component';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { BrandKitService } from '../../../../providers/brandkit/brand-kit.service';
import { GeneralService } from 'src/app/providers/general/general.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-profile-shots',
  templateUrl: './profile-shots.component.html',
  styleUrls: ['./profile-shots.component.scss']
})
export class ProfileShotsComponent {

  @Output() changeHandleDesigText  = new EventEmitter<any>();
  @Output() changeHandleProfileVisible = new EventEmitter<{ isProfileAvtarVisible: boolean, isHandleVisible: boolean,profileAvtar:any }>();

  handleDesigText: string = '';

  isProfileAvtarVisible: boolean = false;
  isHandleVisible: boolean = false;
  profileAvtar:any;

  applyBrandKit:boolean = false;
  dialogRef: any;
  currentSettings:any;
  constructor(
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    private _designControlService: DesignControlService,
    private _brandkit: BrandKitService,
    public _generalService: GeneralService,
    private router: Router,
    public _globalService: GlobalService,
    private _toastr: ToastrService,
  )
  {
    // Patch the settings
    this._designControlService.templateSettings$.pipe(take(1)).subscribe((settings) => {

      console.log("settings profile",settings);
      
      this.currentSettings = settings;
      this.isProfileAvtarVisible = settings?.isProfileAvtarVisible;
      this.isHandleVisible = settings?.isHandleVisible;
      
      this.applyBrandKit   = settings?.isBrandKit;
      if (this.applyBrandKit || settings?.isProfileBrandKit) {
        const event = { target: { checked: true } }; // Mock event object to simulate the checkbox checked state
        this.switchOnBrandkit(event);
      }
    });
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this.handleDesigText = this._utilities.currentProfile?.designation;
    this.profileAvtar = this._utilities.currentProfile?.image ? this._utilities.currentProfile?.image : 'assets/images/avatar/avatar.png';
  }

  onChangeDesigText(event:any){
    this.changeHandleDesigText.emit(event.target.value);
  }

  switchOnBrandkit(event:any){
    if(event.target.checked)
    {
      this.getBrandKit();
      this.applyBrandKit = true;
    }
    else
    {
      this.profileAvtar = this._utilities.currentProfile?.image ? this._utilities.currentProfile?.image : 'assets/images/avatar/avatar.png';
      this.changeHandleProfileVisible.emit({
        isProfileAvtarVisible: this.isProfileAvtarVisible,
        isHandleVisible: this.isHandleVisible,
        profileAvtar: this.profileAvtar
      });
      this.handleDesigText = this._utilities.currentProfile?.designation;
      this.changeHandleDesigText.emit(this.handleDesigText);
      this.applyBrandKit = false;
      this.currentSettings.isProfileBrandKit = false;
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
          
          this.profileAvtar = response?.data?.logoUrl;
          this.changeHandleProfileVisible.emit({
            isProfileAvtarVisible: this.isProfileAvtarVisible,
            isHandleVisible: this.isHandleVisible,
            profileAvtar: this.profileAvtar
          });
          this.handleDesigText = response?.data?.website;
          this.changeHandleDesigText.emit(response?.data?.website);

          this.currentSettings.isProfileBrandKit = true;
          this.updateTheSetting(this.currentSettings);
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

  changeAvtarVisible(event:any,type:any){
    if(type === 'profile')
    {
      this.isProfileAvtarVisible = event.target.checked;
    }
    else
    {
      this.isHandleVisible = event.target.checked;
    }
    
    this.currentSettings.isProfileAvtarVisible = this.isProfileAvtarVisible;
    this.currentSettings.isHandleVisible = this.isHandleVisible;
    this.updateTheSetting(this.currentSettings);

    this.changeHandleProfileVisible.emit({
      isProfileAvtarVisible: this.isProfileAvtarVisible,
      isHandleVisible: this.isHandleVisible,
      profileAvtar: this.profileAvtar
    });

  }

  uploadImage(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this.loaderService.start();
      const formData = new FormData();
      formData.append('file', file, file.name);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.loaderService.stop();            
            this.profileAvtar = response?.data[0]?.url;
            this.changeHandleProfileVisible.emit({
              isProfileAvtarVisible: this.isProfileAvtarVisible,
              isHandleVisible: this.isHandleVisible,
              profileAvtar: this.profileAvtar
            });
          } else {
            this.loaderService.stop();
            this._toastr.error(MessageConstant.unknownError, '');
          }
        },
        (err: ErrorModel) => {
          this.loaderService.stop();
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
  
  updateTheSetting(setting:any){
    this._designControlService.updateTemplateSettings(setting);
  }

}
