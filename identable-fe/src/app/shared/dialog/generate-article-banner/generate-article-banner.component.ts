import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';

// SERVICES
import { GeneralService } from 'src/app/providers/general/general.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
@Component({
  selector: 'app-generate-article-banner',
  templateUrl: './generate-article-banner.component.html',
  styleUrls: ['./generate-article-banner.component.scss'],
})
export class GenerateArticleBannerComponent {
  @ViewChild('bannerImage') bannerImage: ElementRef | undefined;
  backgroundColor: any = '#1849a9';
  imageOverplay: any = '#1849a9';
  bgImage: any;
  selectedImage: any;
  imageSelect: boolean = false;
  isSubmited: boolean = false;
  title: any = '';
  currentProfile: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GenerateArticleBannerComponent>,
    private _generalService: GeneralService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private elementRef: ElementRef,
    public _utilities: CommonFunctionsService
  ) {
    this.bgImage = this.data?.image;

    this.title = this.data?.articleTitle;
  }

  ngOnInit(): void {}

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file.type.indexOf('video') > -1 && file?.size / 1024 / 1024 > 10) {
      this._toastr.error('file is bigger than 10MB');
      return;
    }

    let target = event.target as HTMLInputElement;
    let files = target.files as FileList;
    let image = files[0];

    if (files) {
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        this.bgImage = reader.result as string;
        this.selectedImage = reader.result as string;
      };
      this.imageSelect = true;
    }
  }

  selectImageType(event: any) {
    let isChecked = event.target.checked;
    if (isChecked) {
      this.bgImage = this.selectedImage;
    } else {
      this.bgImage = this.data?.image;
    }
  }

  save() {
    this.isSubmited = true;
    if (!this.title) {
      return;
    }

    this._loader.start();

    html2canvas(this.bannerImage?.nativeElement, {
      logging: true,
      useCORS: true,
    }).then((canvas) => {
      // Convert canvas to image and download
      const imageData = canvas.toDataURL('image/png');
      const capturedImageFile = this.dataURLtoFile(
        imageData,
        'captured_image.png'
      );
      const formData = new FormData();
      formData.append('file', capturedImageFile);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();
          if (response.statusCode == 200) {
            this.dialogRef.close(response?.data[0]?.url);
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
    });
  }

  dataURLtoFile(dataurl: any, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  cancel() {
    this.dialogRef.close();
  }
}
