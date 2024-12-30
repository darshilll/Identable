import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { CrmCampaignService } from 'src/app/providers/crm-campaign/crm-campaign.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-follower-list',
  templateUrl: './follower-list.component.html',
  styleUrls: ['./follower-list.component.scss'],
})
export class FollowerListComponent {
  items: any[] = [];
  campaignName: any;
  selectedFollower: any = [];
  isSubmitted: boolean = false;

  // Pagignation Page
  searchText: any;
  currentPage: number = 1;
  totalRecord: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FollowerListComponent>,
    private _crm: CrmCampaignService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService
  ) {}

  ngOnInit() {
    this.getFollowerList();
  }

  onScrollDown() {
    const totalPage = Math.ceil(this.totalRecord / 10);
    if (this.currentPage < totalPage) {
      this.currentPage++;
      this.getFollowerList();
    }
  }

  getFollowerList() {
    this.isSubmitted = true;
    let obj = {};
    let pageId = this._utilities.userData?.currentPageId;
    obj = {
      page: this.currentPage,
      pageId: pageId,
    };

    if (this.searchText) {
      obj = {
        ...obj,
        searchText: this.searchText,
      };
    }

    this.loaderService.start();
    this._crm.getConnectedList(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          let newData = response.data?.items;
          this.totalRecord = response.data?.count;
          this.items = [...this.items, ...newData];
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  sendInvitaion() {
    let obj = {};

    if (!this.campaignName) {
      this.toastr.error('Please enter campaign name.');
      return;
    }

    let pageId = this._utilities.userData?.currentPageId;
    obj = {
      pageId: pageId,
      campaignName: this.campaignName,
      followerIds: this.selectedFollower,
    };

    this.loaderService.start();
    this._crm.sendInvitaion(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  searchFollower(event: any) {
    this.searchText = event.target.value;
    this.items = [];
    this.currentPage = 1;
    this.getFollowerList();
  }

  selectFollower(event: any) {
    let isChecked = event.target.checked;
    let value = event.target.value;

    if (isChecked && this.selectedFollower?.length >= 10) {
      this.toastr.error(
        'Only allow a maximum of 10 followers to be selected at a time'
      );
      event.preventDefault();
      return;
    }

    if (isChecked) {
      this.selectedFollower.push(value);
    } else {
      let updatedArray = this.selectedFollower.filter(
        (item: any) => item != value
      );
      this.selectedFollower = updatedArray;
    }
  }
}
