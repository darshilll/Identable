import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

// LIBRARY
import { ToastrService } from 'ngx-toastr';

// Services
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { BrandKitService } from 'src/app/providers/brandkit/brand-kit.service';

import { SelectMediaComponent } from '../../../../shared/common/select-media/select-media.component';
//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';
@Component({
  selector: 'app-cover-image-setting',
  templateUrl: './cover-image-setting.component.html',
  styleUrls: ['./cover-image-setting.component.scss'],
})
export class CoverImageSettingComponent {
  selectLayout: any = 'center';
  headline: any;
  isBrandkit: boolean = false;
  brandkitSeting: any;
  articleLayout: any = [
    {
      layout: 'center',
      image: 'assets/images/ai-article/cover-image-1.png',
    },
    {
      layout: 'left',
      image: 'assets/images/ai-article/cover-image-2.png',
    },
    {
      layout: 'right',
      image: 'assets/images/ai-article/cover-image-3.png',
    },
  ];
  mediaDialogRef: any;

  // Credit deducated
  creditDeducated: number = 0;
  creditMessage: any;

  logoUrl: any;
  bannerColor: any = '#000000';

  // Upload image dialog
  dialogReff: any;
  isSubmit: boolean = false;

  coverImage: any;
  profileImage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<CoverImageSettingComponent>,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService,
    private _loader: LoaderService,
    private _brandkit: BrandKitService
  ) {
    if (this.data) {
      this.selectLayout = this.data?.layout ? this.data?.layout : 'center';
      this.bannerColor = this.data?.bannerColor
        ? this.data?.bannerColor
        : '#000000';
      this.headline = this.data?.headline;
      this.coverImage = this.data?.coverImage;
      this.profileImage = this.data?.profileAvatar;
    }
  }

  save() {
    this.isSubmit = true;
    if (!this.headline || !this.bannerColor) {
      return;
    }
    let currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );

    let profileAvatar = currentProfile?.image
      ? currentProfile?.image
      : 'assets/images/avatar/avatar.png';
    if (this.isBrandkit) {
      profileAvatar = this.logoUrl;
    }

    let bannerSetting = {
      layout: this.selectLayout,
      coverImage: this.coverImage,
      headline: this.headline,
      profileAvatar: profileAvatar,
      bannerColor: this.bannerColor,
      isBrandkit: this.isBrandkit,
    };

    this.dialogRef.close(bannerSetting);
  }

  onSelectLayout(layout: any) {
    this.selectLayout = layout;
  }

  selectBrandkit(event: any) {
    let isChecked = event.target.checked;
    if (this.brandkitSeting) {
      this.logoUrl = this.brandkitSeting?.logoUrl;
      this.bannerColor = this.brandkitSeting?.primaryColor;
    }
    if (isChecked && !this.brandkitSeting) {
      this.getBrandKit();
    }
  }

  getBrandKit() {
    this._loader.start();
    this._brandkit.list({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.brandkitSeting = response?.data;
          if (this.brandkitSeting) {
            this.logoUrl = this.brandkitSeting?.logoUrl;
            this.bannerColor = this.brandkitSeting?.primaryColor;
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

    if (type == 'primaryColor') {
      this.bannerColor = inputElement.value;
    }
  }

  choiceMediaOptions() {
    this.mediaDialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      data: {},
    });
    this.mediaDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.coverImage = result?.url;
      }
    });
  }
}
