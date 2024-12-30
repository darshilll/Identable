import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { UserService } from '../../providers/user/user.service';
import { LoaderService } from '../../providers/loader-service/loader.service';

//UTILS
import { ErrorModel } from '../models/error';
import { ResponseModel } from '../models/response';
import { MessageConstant } from '../message-constant';
import { CommonFunctionsService } from './common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _userService: UserService,
    public _utilities: CommonFunctionsService
  ) {}

  async getUserDetails(obj: any) {
    let { isRefresh = true } = obj;

    return new Promise(async (resolve, reject) => {
      if (isRefresh == false) {
        if (this._utilities.userData?._id != null) {
          resolve(true);
          return;
        }
      }

      this.loaderService.start();
      this._userService.getUserDetails({}).subscribe(
        (response: ResponseModel) => {
          this.loaderService.stop();

          if (response.statusCode == 200) {
            this._utilities.userData = response?.data;
            this._utilities.chatGPTModel = response?.data?.chatGPTVersion;
            this._utilities.sendEventToServer('loginEvent', {
              message: this._utilities.userData?._id?.toString(),
            });
          } else {
            this.toastr.error(MessageConstant.unknownError, '');
          }
          resolve(true);
        },
        (err: ErrorModel) => {
          this.loaderService.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this.toastr.error(error.message, '');
          } else {
            this.toastr.error(MessageConstant.unknownError, '');
          }
          resolve(false);
        }
      );
    });
  }

  async getLinkedinPageList(obj: any) {
    let { isRefresh = true } = obj;

    return new Promise(async (resolve, reject) => {
      if (isRefresh == false) {
        if (this._utilities.linkedinPageList?.length > 0) {
          this._utilities.currentProfile =
            this._utilities?.linkedinPageList?.find(
              (x: any) => x._id == this._utilities.userData?.currentPageId
            );
          resolve(true);
          return;
        }
      }

      this.loaderService.start();
      this._userService.getLinkedinPageList({}).subscribe(
        (response: ResponseModel) => {
          this.loaderService.stop();

          if (response.statusCode == 200) {
            this._utilities.linkedinProfileData =
              response.data?.linkedinProfileData;
            this._utilities.linkedinPageList = response.data?.linkedinPageData;

            this._utilities.linkedinAccessPageList =
              this._utilities.linkedinPageList?.filter((x: any) => x?.isAccess);

            this._utilities.pageList = this._utilities.linkedinPageList?.filter(
              (x: any) => x?.type == 'page'
            );

            if (this._utilities.linkedinPageList?.length > 0) {
              this._utilities.userData.isIntegration = true;
            }

            this._utilities.currentProfile =
              this._utilities?.linkedinPageList?.find(
                (x: any) => x._id == this._utilities.userData?.currentPageId
              );
          } else {
            this.toastr.error(MessageConstant.unknownError, '');
          }
          resolve(true);
        },
        (err: ErrorModel) => {
          this.loaderService.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this.toastr.error(error.message, '');
          } else {
            this.toastr.error(MessageConstant.unknownError, '');
          }
          resolve(false);
        }
      );
    });
  }
}
