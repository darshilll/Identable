import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

//services
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-ai-image-generate',
  templateUrl: './ai-image-generate.component.html',
  styleUrls: ['./ai-image-generate.component.scss'],
})
export class AiImageGenerateComponent {
  aiImageList: any = [];
  creditDeducated: number = 0;
  creditMessage: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AiImageGenerateComponent>,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService
  ) {}

  ngOnInit(): void {
    this.getAiImage();
    this.creditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  getAiImage() {
    this._loader.start();
    this._aiImage.getAiImage({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.aiImageList = response?.data;
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

  selectImage(imageUrl: any) {
    this.dialogRef.close({ image: imageUrl });
  }

  generateAiImage() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);
    let payload = {};
    payload = {
      topic: this.data?.topic,
    };
    if (this.data?.size) {
      payload = {
        ...payload,
        size: this.data?.size,
      };
    }
    this._aiImage.generateAIImage(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          let image = response?.data;
          this.dialogRef.close({ image: image });
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
}
