import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import { ImageCroppedEvent } from 'ngx-image-cropper';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';

//UTILS
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-edit-brand-logo',
  templateUrl: './edit-brand-logo.component.html',
  styleUrls: ['./edit-brand-logo.component.scss'],
})
export class EditBrandLogoComponent {
  imageChangedEvent: any = '';
  imageURL: any = '';
  croppedImage: any = '';
  scale = 1;
  rotation = 0; // This is for 90-degree steps
  straighten = 0; // This will be for small rotation adjustments

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditBrandLogoComponent>,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    public _generalService: GeneralService
  ) {
    if (data?.imageUrl) {
      this.imageURL = data?.imageUrl;
    } else {
      this.imageChangedEvent = data;
    }
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
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this._loader.start();
      const formData = new FormData();
      formData.append('file', file, file.name);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this._loader.stop();
            this.imageURL = response?.data[0]?.url;
            this.data.logoUrl = response?.data[0]?.url;
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

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  zoomOut(): void {
    if (this.scale > 0.1) {
      this.scale = this.scale - 0.1;
    }
  }

  zoomIn(): void {
    if (this.scale < 2) {
      this.scale = this.scale + 0.1;
    }
  }

  rotateLeft(): void {
    this.rotation = this.rotation - 90;
  }

  rotateRight(): void {
    this.rotation = this.rotation + 90;
  }

  saveImage(): void {
    this.dialogRef.close(this.croppedImage);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editDialog(): void {
    this.data.isViewBrandLogo = false;
  }

  deleteImage() {
    this.dialogRef.close({ isAction: 'deleteImage' });
  }

  // Function to update the straighten value (for small angle changes)
  straightenChange(value: number): void {
    this.straighten = value;
  }
}
