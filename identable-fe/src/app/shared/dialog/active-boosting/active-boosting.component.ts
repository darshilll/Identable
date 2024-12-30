import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

//services
import { PostService } from 'src/app/providers/post/post.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-active-boosting',
  templateUrl: './active-boosting.component.html',
  styleUrls: ['./active-boosting.component.scss'],
})
export class ActiveBoostingComponent {
  creditDeducated: number = 0;
  creditMessage: any;

  boostType: any = [
    {
      likes: 10,
      comments: 10,
      repost: 1,
    },
    {
      likes: 20,
      comments: 10,
      repost: 2,
    },
    {
      likes: 30,
      comments: 15,
      repost: 3,
    },
    {
      likes: 40,
      comments: 20,
      repost: 4,
    },
  ];
  boosTypeIndex: Number = 0;
  boosTypeSelected: any = {
    likes: 10,
    comments: 10,
    repost: 1,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActiveBoostingComponent>,
    public _utilities: CommonFunctionsService,
    public _post: PostService,
    private _toastr: ToastrService,
    private _loader: LoaderService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.boostingCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  selectBootType(boot: any, index: any) {
    this.boosTypeIndex = index;
    this.boosTypeSelected = boot;
  }

  Cancel() {
    this.dialogRef.close(true);
  }

  postBoostingActive() {
    let payload = {
      isBoosting: true,
      likeCount: this.boosTypeSelected?.likes,
      postId: this.data?._id,
    };
    this._post.postBoostingActive(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          this.dialogRef.close(this.data);
          this._toastr.success(response?.message);
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
