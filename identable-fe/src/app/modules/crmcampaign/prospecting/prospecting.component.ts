import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CrmCampaignService } from '../../../providers/crm-campaign/crm-campaign.service';

// COMPONENTS
import { CrmGetEmailComponent } from '../../../shared/dialog/crm-get-email/crm-get-email.component';
import { CrmGetEmailCreditComponent } from '../../../shared/dialog/crm-get-email-credit/crm-get-email-credit.component';
import { DeleteConfirmationPopupComponent } from '../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';
import { FollowerListComponent } from '../../../shared/dialog/follower-list/follower-list.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-prospecting',
  templateUrl: './prospecting.component.html',
  styleUrls: ['./prospecting.component.scss'],
})
export class ProspectingComponent {
  @Input() connetionType: string | any;

  dialogRef: any;

  // Assign Post Data
  prospectData: any[] = [];

  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;

  isDataLoaded: boolean = false;

  constructor(
    private crmCampaignService: CrmCampaignService,
    private _dialog: MatDialog,
    private _titleService: Title,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService
  ) {}

  ngOnInit(): void {
    //this.openFollowerListDialog()
    console.log('this.connetionType', this.connetionType);
    if (this.connetionType == 'prospecting') {
      this._utilities.refreshProspectData = new Subject();
      this._utilities.refreshProspectData.subscribe((response: any) => {
        console.log('refreshProspectData response = ', response);

        if (this.prospectData?.length == 0) {
          this.currentPage = 1;
          this.getProspectList();
        }
      });
    } else if (this.connetionType == 'companyFollowers') {
      this._utilities.refreshProspectData = new Subject();
      this._utilities.refreshProspectData.subscribe((response: any) => {
        console.log('refreshProspectData response = ', response);

        if (this.prospectData?.length == 0) {
          this.currentPage = 1;
          this.getProspectList();
        }
      });
    }
    
    // Search
    this._utilities.refreshProspects = new Subject();
    this._utilities.refreshProspects.subscribe((response: any) => {
      console.log('refreshProspectData response = ', response);

      this.currentPage = 1;
      this.getProspectList();
    });

    this.getProspectList();

    this._utilities.refreshDiscoverEmail = new Subject();
    this._utilities.refreshDiscoverEmail.subscribe((response: any) => {
      console.log('refreshDiscoverEmail response = ', response);

      let connectionId = response?.data?._id;
      if (connectionId) {
        let filterArray = this.prospectData?.filter(
          (x: any) => x?._id == connectionId
        );
        if (filterArray?.length > 0) {
          filterArray[0].email = response?.data?.email;
          filterArray[0].enrowEmailStatus = response?.data?.enrowEmailStatus;
          if (response?.data?.enrowEmailStatus != 'completed') {
            this.openEmailDialog(filterArray[0]);
          }
        }
      }
    });
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getProspectList();
  }

  getProspectList() {
    let param = {
      page: this.currentPage,
      type: this.connetionType,
      searchText: this._utilities.prospectSearchText,
      campaignId: this._utilities.prospectCampaignId,
    };

    this.loaderService.start();
    this.crmCampaignService.getProspectList(param).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        this.isDataLoaded = true;
        if (response.statusCode == 200) {
          let totalItems = response?.data?.count || 0;
          let pageSize = response?.data?.limit || 0;
          this.totalPages = Math.ceil(totalItems / pageSize);
          this.prospectData = response?.data?.items;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.isDataLoaded = true;
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

  removeProspecting(prospectId: any) {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteProspect(prospectId);
      }
    });
  }

  deleteProspect(prospectId: any) {
    let param = {
      prospectId: prospectId,
    };

    this.loaderService.start();
    this.crmCampaignService.deleteProspect(param).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.toastr.success(response?.data);
          this.getProspectList();
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

  openDiscoverEmailCreditDialog(data: any) {
    if (data?.email) {
      this.openEmailDialog(data);
      return;
    }
    if (data?.enrowEmailStatus == 'processing') {
      this.toastr.success(
        'Your request is being processing. Please check again later.'
      );
      return;
    }
    if (data?.enrowEmailStatus == 'failed') {
      this.toastr.error('Your request is failed. Please contact support.');
      return;
    }
    this.dialogRef = this._dialog.open(CrmGetEmailCreditComponent, {
      width: '650px',
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.discoverEmail(data);
      }
    });
  }

  openEmailDialog(userData: any) {
    this.dialogRef = this._dialog.open(CrmGetEmailComponent, {
      width: '650px',
      data: userData,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.discoverEmail(result);
      }
    });
  }

  openFollowerListDialog() {
    this.dialogRef = this._dialog.open(FollowerListComponent, {
      width: '650px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  discoverEmail(prospectData: any) {
    let payload = {
      connectionId: prospectData?._id,
      isProspect: this.connetionType == 'connected' ? false : true,
    };

    this.loaderService.start();

    this.crmCampaignService.discoverEmail(payload).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          let data = response?.data;
          prospectData.enrowEmailStatus = 'processing';
          this.toastr.success(data?.message);
          let credit = this._utilities?.userData?.plan?.discoverEmailCredit | 0;
          this._utilities.userData.subscription.credit - credit;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        this.dialogRef.close();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }
}
