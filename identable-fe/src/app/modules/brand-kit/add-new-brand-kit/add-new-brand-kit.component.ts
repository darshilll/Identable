import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { BrandKitService } from '../../../providers/brandkit/brand-kit.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';

// COMPONENTS
import { EditBrandLogoComponent } from '../dialog/edit-brand-logo/edit-brand-logo.component';

//UTILS
import { designControl } from '../../../utils/carousel-control/design-control';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-add-new-brand-kit',
  templateUrl: './add-new-brand-kit.component.html',
  styleUrls: ['./add-new-brand-kit.component.scss'],
})
export class AddNewBrandKitComponent {
  // edit logo dialog
  dialogRef: any;
  imageUrl: any;
  logoUrl: any;
  primaryColor: any;
  secondaryColor: any;
  accent1Color: any;
  accent2Color: any;
  titleFont: any = '';
  bodyFont: any = '';
  currentProfile: any;
  contact: any;
  website: any;
  isSubmitted: boolean = false;
  isInvalidWebsiteUrl: boolean = false;
  isInvalidContact: boolean = false;
  fontFamilyList: any = designControl?.fontFamilyList;
  brandKitData: any;
  urlPattern: any = new RegExp(
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  );
  numberPattern: any = /^[0-9+\-\(\)]*$/;

  constructor(
    private _dialog: MatDialog,
    private _brandkit: BrandKitService,
    private _titleService: Title,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    public _generalService: GeneralService
  ) {
    this._titleService.setTitle('Identable | BrandKit');
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.setCurrentProfileData();
    this.getBrandKit();
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  editBrandLogo(event: any) {
    this.dialogRef = this._dialog.open(EditBrandLogoComponent, {
      width: '800px',
      disableClose: false,
      data: event,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.uploadLogoImage(result);
        this.uploadImage(event);
      }
    });
  }

  viewBrandLogo() {
    let data = {
      logoUrl: this.logoUrl,
      imageUrl: this.imageUrl,
      isViewBrandLogo: true,
    };
    this.dialogRef = this._dialog.open(EditBrandLogoComponent, {
      width: '800px',
      disableClose: false,
      data: data,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result?.isAction == 'deleteImage') {
          this.logoUrl = '';
          this.imageUrl = '';
        } else {
          this.uploadLogoImage(result);
        }
      }
    });
  }

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file.type.indexOf('video') > -1) {
      this._toastr.error('file is not allow');
      return;
    }
    if (file.type.indexOf('pdf') > -1) {
      this._toastr.error('file is not allow');
      return;
    }
    this.editBrandLogo(event);
  }

  uploadImage(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this._loader.start();
      const formData = new FormData();
      formData.append('file', file, file.name);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.imageUrl = response?.data[0]?.url;
            this._loader.stop();
          } else {
            this._loader.stop();
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

  saveBrandKit() {
    this.isSubmitted = true;
    if (
      !this.titleFont ||
      !this.bodyFont ||
      !this.logoUrl ||
      !this.primaryColor ||
      !this.secondaryColor
    ) {
      return;
    }
    if (this.website) {
      let isValidUrl = this.urlPattern.test(this.website);
      if (!isValidUrl) {
        this.isInvalidWebsiteUrl = true;
        return;
      }
    }
    if (this.contact) {
      let isValidUrl = this.numberPattern.test(this.contact);
      if (!isValidUrl) {
        this.isInvalidContact = true;
        return;
      }
    }

    this._loader.start();
    let param = {
      imageUrl: this.imageUrl,
      logoUrl: this.logoUrl,
      primaryColor: this.primaryColor,
      secondaryColor: this.secondaryColor,
      accent1Color: this.accent1Color,
      accent2Color: this.accent2Color,
      titleFont: this.titleFont,
      bodyFont: this.bodyFont,
      contact: this.contact,
      website: this.website,
    };

    this._brandkit.save(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.isSubmitted = false;
          this.isInvalidWebsiteUrl = false;
          this.isInvalidContact = false;
          this._toastr.success(response?.data);
          this.brandKitData = param;
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

  getBrandKit() {
    this._loader.start();
    this._brandkit.list({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.brandKitData = response?.data;
          if (this.brandKitData) {
            this.imageUrl = this.brandKitData?.imageUrl;
            this.logoUrl = this.brandKitData?.logoUrl;
            this.primaryColor = this.brandKitData?.primaryColor;
            this.secondaryColor = this.brandKitData?.secondaryColor;
            this.accent1Color = this.brandKitData?.accent1Color;
            this.accent2Color = this.brandKitData?.accent2Color;
            this.titleFont = this.brandKitData?.titleFont;
            this.bodyFont = this.brandKitData?.bodyFont;
            this.contact = this.brandKitData?.contact;
            this.website = this.brandKitData?.website;
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

    if (type == 'primary') {
      this.primaryColor = inputElement.value;
    } else if (type == 'secondary') {
      this.secondaryColor = inputElement.value;
    } else if (type == 'accent1') {
      this.accent1Color = inputElement.value;
    } else if (type == 'accent2') {
      this.accent2Color = inputElement.value;
    }
  }

  removeColor(type: any) {
    if (type == 'primary') {
      this.primaryColor = '';
    } else if (type == 'secondary') {
      this.secondaryColor = '';
    } else if (type == 'accent1') {
      this.accent1Color = '';
    } else if (type == 'accent2') {
      this.accent2Color = '';
    }
  }

  uploadLogoImage(base64: string): void {
    const blob = this.base64ToBlob(base64);
    const formData = new FormData();
    formData.append('file', blob, 'cropped-image.png');

    this._loader.start();
    this._generalService.uploadFile(formData).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode === 200) {
          this.logoUrl = response?.data[0]?.url;
          this._loader.stop();
        } else {
          this._loader.stop();
          this._toastr.error('Unknown Error', '');
        }
      },
      (error) => {
        this._loader.stop();
        this._toastr.error('Unknown Error', '');
      }
    );
  }

  base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]); // Decode base64 string
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]; // Get the mime type
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString }); // Return the Blob object
  }

  onChangeTitleFont(event: any) {
    let value = event.target.value;
  }

  onChangeBodyFont(event: any) {
    let value = event.target.value;
  }

  removeLogo() {
    this.imageUrl = '';
    this.logoUrl = '';
  }
}
