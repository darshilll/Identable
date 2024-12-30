import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ColorEvent } from 'ngx-color';

//SERVICES
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';
import { GeneralService } from 'src/app/providers/general/general.service';

// COMPOMENT
import { SaveThemeComponent } from '../save-theme/save-theme.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-add-custom-carousel-theme',
  templateUrl: './add-custom-carousel-theme.component.html',
  styleUrls: ['./add-custom-carousel-theme.component.scss'],
})
export class AddCustomCarouselThemeComponent {
  isImageSelected: boolean = false;
  isImage: any;
  color: any = '#333856'; // Initial color value
  fontColor: any = '#fff'; // Initial color value
  showColorPicker: boolean = false;
  showColorPickerFont: boolean = false;
  isSignatureAlign: boolean = true;
  themDialogRef: any;

  currentProfile: any;

  backgroundColorList = [
    '#fff',
    '#4cc15a',
    '#7a45a9',
    '#ffb5c1',
    '#2d9bee',
    '#904984',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddCustomCarouselThemeComponent>,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _carouselService: CarouselService,
    public _generalService: GeneralService
  ) {
    this.currentProfile = data?.currentProfile;
  }

  addImage(event: any) {
    this._loader.start();
    let target = event.target as HTMLInputElement;
    let files = target.files as FileList;
    let image = files[0];
    const formData = new FormData();
    formData.append('files', image);
    this._generalService.uploadFile(formData).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          if (response?.data[0]?.url) {
            this._loader.stop();
            this.isImageSelected = true;
            this.isImage = response?.data[0]?.url;
            this.color = '';
          }
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

  removeImage() {
    this.isImageSelected = false;
    this.isImage = '';
  }

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  toggleColorPickerFont() {
    this.showColorPickerFont = !this.showColorPickerFont;
  }

  onColorChange(event: any, type?: any) {
    this.selectColor(event?.color?.hex, type);
  }

  selectColor(color: any, type?: any) {
    if (type) {
      this.fontColor = color;
    } else {
      this.color = color;
      this.isImageSelected = false;
      this.isImage = '';
    }
  }

  saveThem() {
    this.themDialogRef = this._dialog.open(SaveThemeComponent, {
      width: '400px',
      // panelClass: 'custom-edit-post-modal',
      data: {},
    });

    this.themDialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.isSave) {
        this._loader.start();
        let payload = {};

        payload = {
          fontColor: this.fontColor,
          signatureAlign: this.isSignatureAlign ? 'left' : 'right',
        };

        if (this.isImageSelected) {
          payload = {
            ...payload,
            backgroundMedia: this.isImage,
          };
        } else {
          payload = {
            ...payload,
            backgroundColor: this.color,
          };
        }

        this._carouselService.addTheme(payload).subscribe(
          (response: ResponseModel) => {
            if (response.statusCode == 200) {
              this._loader.stop();
              this.dialogRef.close({ isAddTheme: true });
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
    });
  }

  nameiconAlign(align: boolean) {
    if (align) {
      this.isSignatureAlign = true;
    } else {
      this.isSignatureAlign = false;
    }
  }
}
