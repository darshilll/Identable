import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import saveAs from 'file-saver';

//services
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';

// Component
import { SuggestIdeaComponent } from '../../../shared/common/suggest-idea/suggest-idea.component';
import { AiPreviewImageComponent } from '../../../shared/common/ai-preview-image/ai-preview-image.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';

@Component({
  selector: 'app-generated-image',
  templateUrl: './generated-image.component.html',
  styleUrls: ['./generated-image.component.scss'],
})
export class GeneratedImageComponent {
  selectedImageSize: any;
  imageSizes = [
    {
      value: '1792x1024',
      label: 'Landscape',
      icon: 'assets/images/landscape-icon.png',
    },
    {
      value: '1024x1024',
      label: 'Square',
      icon: 'assets/images/square-icon.png',
    },
    {
      value: '1024x1792',
      label: 'Portrait',
      icon: 'assets/images/portrait-icon.png',
    },
  ];

  imageTypes = [
    {
      category: 'Realistic',
      images: [
        { src: 'assets/images/ai-img-1.png', label: 'Photography' },
        { src: 'assets/images/ai-img-2.png', label: 'Analog Film' },
      ],
    },
    {
      category: 'Artistic',
      images: [
        { src: 'assets/images/ai-img-3.png', label: 'Anime' },
        { src: 'assets/images/ai-img-4.png', label: 'Digital Art' },
        { src: 'assets/images/ai-img-5.png', label: 'Fantasy Art' },
        { src: 'assets/images/ai-img-6.png', label: 'Vaporware' },
        { src: 'assets/images/ai-img-7.png', label: 'Isometric' },
        { src: 'assets/images/ai-img-8.png', label: 'Low Poly' },
        { src: 'assets/images/ai-img-9.png', label: 'Claymation' },
        { src: 'assets/images/ai-img-10.png', label: 'Origami' },
        { src: 'assets/images/ai-img-11.png', label: 'Line Art' },
        { src: 'assets/images/ai-img-12.png', label: 'Pixel Art' },
        { src: 'assets/images/ai-img-13.png', label: 'Texture' },
      ],
    },
  ];

  // Ai Genrated Image
  genratedImageList: any;
  resultGenratedImage: any;

  genratedImageForm: FormGroup;
  submitted: boolean = false;

  // Credit Manage
  creditDeducated: number = 0;
  creditMessage: any;

  // Image style
  toChoiceImageStyle: boolean = false;
  selectedStyle: any = {
    src: 'assets/images/ai-img-1.png',
    label: 'Photography',
  };

  // Suggest idea dialog
  suggestDialogRef: any;

  dialogRef: any;

  constructor(
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService,
    public _generalService: GeneralService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService,
    public _globalService: GlobalService
  ) {
    this.genratedImageForm = this.formBuilder.group({
      topic: ['', [Validators.required]],
      imageStyle: ['', [Validators.required]],
      size: ['', [Validators.required]],
    });
    this.getAIImagesByDate();
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.creditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.genratedImageForm.controls[controlName].hasError(errorName);
  };

  showImageStyle() {
    this.toChoiceImageStyle = !this.toChoiceImageStyle;
  }

  selectImageStyle(style: any) {
    this.selectedStyle = style;
    this.genratedImageForm.get('imageStyle')?.setValue(style?.label);
    this.toChoiceImageStyle = false;
  }

  selectImageSize(event: any) {
    let imageSize = event?.value?.value;
    this.genratedImageForm.get('size')?.setValue(imageSize);
  }

  downloadImage(imageUrl: any) {
    const blob = this.dataURLToBlob(imageUrl);
    const fileName = this.getFileNameFromUrl(imageUrl);
    saveAs(blob, fileName);
  }

  dataURLToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0]?.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'downloaded-image';
  }

  // Get genrated image list

  getAIImagesByDate() {
    this._loader.start();
    this._aiImage.getAIImagesByDate({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.genratedImageList = response?.data;
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

  // Get Ai image idea

  getAIImageIdea() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    let payload = {};
    this._aiImage.getAIImageIdea(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.openSuggestDailog(response.data);
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

  openSuggestDailog(suggestData: any) {
    this.suggestDialogRef = this._dialog.open(SuggestIdeaComponent, {
      width: '650px',
      data: suggestData,
    });
    this.suggestDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.genratedImageForm.get('topic')?.setValue(result?.idea);
      }
    });
  }

  // Genrated Ai image

  generateImage() {
    this.submitted = true;
    if (!this.genratedImageForm.valid) {
      return;
    }

    const { topic, size } = this.genratedImageForm.value;

    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    let payload = {
      topic: topic,
      imageStyle: this.selectedStyle?.label,
      size: size,
    };
    this._aiImage.generateImage(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.resultGenratedImage = response?.data;
          this._utilities.manageCredit(false, this.creditDeducated);
          this.getAIImagesByDate();
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

  aiPreviewimage(imageUrl: any) {
    this.dialogRef = this._dialog.open(AiPreviewImageComponent, {
      width: '800px',
      panelClass: 'ide-ai-preview-modal',
      disableClose: false,
      data: { imageUrl: imageUrl },
    });
  }
}
