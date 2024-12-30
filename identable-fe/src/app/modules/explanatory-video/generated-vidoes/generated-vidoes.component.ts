import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiVideoService } from '../../../providers/aiVideo/ai-video.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

// COMPONENTS
import { DeleteConfirmationPopupComponent } from '../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';

@Component({
  selector: 'app-generated-vidoes',
  templateUrl: './generated-vidoes.component.html',
  styleUrls: ['./generated-vidoes.component.scss'],
})
export class GeneratedVidoesComponent {
  // assign video data
  genratedVideoList: any[] = [];

  dialogRef: any;
  searchVideo: string = '';
  constructor(
    public _aiVideoService: AiVideoService,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService,
    private router: Router
  ) {
    this.getGenratedVideoList();

    this._utilities.refreshAIVideoData = new Subject();
    this._utilities.refreshAIVideoData.subscribe((response: any) => {
      let filterArray = this.genratedVideoList?.filter(
        (x: any) => x?._id == response?.data?._id
      );
      if (
        response?.data?.status == 'error' ||
        response?.data?.status == 'complete'
      ) {
        this.getGenratedVideoList();
      } else {
        if (filterArray?.length > 0) {
          filterArray[0].progress = response?.data?.progress;
        }
      }
    });
  }

  getGenratedVideoList() {
    this._loader.start();
    let payload = {};
    if (this.searchVideo) {
      payload = {
        ...payload,
        searchText: this.searchVideo,
      };
    }
    this._aiVideoService.getVideoList(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.genratedVideoList = response?.data;
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

  removeSearch() {
    this.searchVideo = '';
    this.getGenratedVideoList();
  }

  linkToSingleVideo(data: any) {
    this._utilities.aiVideoData = data;
    this.router.navigate(['/explanatory-video/view']);
  }

  removeVideo(listData: any) {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.aiVideoDelete(listData);
      }
    });
  }

  aiVideoDelete(listData: any) {
    let obj = { videoId: listData?._id };
    this._loader.start();
    this._aiVideoService.aiVideoDelete(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._loader.stop();
          this.getGenratedVideoList();
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
