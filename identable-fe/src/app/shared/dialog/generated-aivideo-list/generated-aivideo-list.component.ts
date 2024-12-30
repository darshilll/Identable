import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

//LIBRARY
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiVideoService } from '../../../providers/aiVideo/ai-video.service';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-generated-aivideo-list',
  templateUrl: './generated-aivideo-list.component.html',
  styleUrls: ['./generated-aivideo-list.component.scss'],
})
export class GeneratedAivideoListComponent {
  videoList: any[] = [];
  constructor(
    private dialogRef: MatDialogRef<GeneratedAivideoListComponent>,
    public _aiVideoService: AiVideoService,
    private loaderService: LoaderService,
    private toastrService: ToastrService
  ) {
    this.getVideoList();
  }

  getVideoList() {
    this.loaderService.start();
    this._aiVideoService.getVideoList({}).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.videoList = response?.data;
        } else {
          this.loaderService.stop();
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  userSchedule(value: any) {
    this.dialogRef.close(value);
  }

  onPreview(value: any) {
    let newVal = {
      ...value,
      isPreview: true,
    };
    this.dialogRef.close(newVal);
  }

  onClose() {
    this.dialogRef.close();
  }
}
