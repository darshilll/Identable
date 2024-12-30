import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { PostService } from 'src/app/providers/post/post.service';

// COMPONENTS
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-view-generated-video',
  templateUrl: './view-generated-video.component.html',
  styleUrls: ['./view-generated-video.component.scss'],
})
export class ViewGeneratedVideoComponent {
  scheduleDialogOpen: boolean = false;

  // Assign Video Data
  videoUrl: any;

  singleVideoData: any;
  generatedTypeId: string = '';
  constructor(
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    private _dialog: MatDialog,
    public _post: PostService,
    private http: HttpClient,
    private router: Router
  ) {
    this.singleVideoData = this._utilities.aiVideoData;
    if (!this.singleVideoData) {
      this.router.navigate(['/explanatory-video']);
    }
    this.videoUrl = this.singleVideoData?.videoUrl;
    this.generatedTypeId = this.singleVideoData?._id;
  }

  scheduleDialogOpenClose(status: boolean) {
    if (status) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  downloadVideo() {
    this._loader.start();
    this.http
      .get(this.videoUrl, { responseType: 'blob' })
      .subscribe((data: any) => {
        const blob = new Blob([data], { type: 'video/mp4' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = this.singleVideoData.topic+'.mp4';
        downloadLink.click();
        this._loader.stop();
      });
  }

  // Post Schedule

  postScheduled(scheduleData: any) {
    if (!this.videoUrl) {
      this._toastr.error('Video not found', '');
      return;
    }

    let payload = {};
    payload = {
      postBody: ' ',
      generatedType: commonConstant.POSTGENERATETYPE.AI_VIDEO,
      status: commonConstant.POSTSTATUS.SCHEDULED,
      postMedia: this.videoUrl,
      generatedTypeId: this.generatedTypeId,
      postMediaType: commonConstant.POSTMEDIATYPE.AI_VIDEO,
    };

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
      };
    }

    this._loader.start();
    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.scheduleDialogOpen = false;
          let advancedScheduleCredit =
            this._utilities?.userData?.plan?.advancedScheduleCredit;
          this._utilities.manageCredit(false, advancedScheduleCredit);
          this._toastr.success(response?.message);
          this._loader.stop();
          this.openConfirmPostScheduled();
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

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }
}
