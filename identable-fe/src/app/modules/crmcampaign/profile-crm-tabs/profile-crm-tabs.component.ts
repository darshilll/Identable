import { Component, Input, SimpleChanges } from '@angular/core';
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
import { DeleteConfirmationPopupComponent } from '../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-profile-crm-tabs',
  templateUrl: './profile-crm-tabs.component.html',
  styleUrls: ['./profile-crm-tabs.component.scss'],
})
export class ProfileCrmTabsComponent {
  @Input() connetionType: string | any;
  @Input() activeCampaignId: string | any;
  @Input() key: any;

  tdElement: HTMLElement | null = null;

  // Add Header
  feildsHeaderData: any[] = [];

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

  ngOnChanges(changes: SimpleChanges): void {
    this.getProspectList();
  }

  ngOnInit(): void {
    if (
      this._utilities.currentProfile?.type !== 'page' &&
      this.connetionType === 'connected'
    ) {
      this.feildsHeaderData.push(
        { label: 'Name' },
        { label: 'Campaign Name' },
        { label: 'Prospect Type' }
      );
    } else if (
      this._utilities.currentProfile?.type !== 'page' &&
      (this.connetionType === 'prospecting' ||
        this.connetionType === 'warming' ||
        this.connetionType === 'following' ||
        this.connetionType === 'connecting' ||
        this.connetionType === 'ignored' ||
        this.connetionType === 'dropped')
    ) {
      this.feildsHeaderData.push(
        { label: 'Name' },
        { label: 'Campaign Name' },
        { label: 'Location' },
        { label: 'Summary' },
        { label: 'Insight' },
        { label: 'ProspectType' }
      );
    } else if (
      this._utilities.currentProfile?.type === 'page' &&
      this.connetionType === 'companyFollowers'
    ) {
      this.feildsHeaderData.push(
        { label: 'Name' },
        { label: 'Campaign Name' },
        { label: 'Headline' }
      );
    } else if (
      this._utilities.currentProfile?.type === 'page' &&
      this.connetionType === 'companyFollowing'
    ) {
      this.feildsHeaderData.push(
        { label: 'Name' },
        { label: 'Campaign Name' },
        { label: 'Occupation' }
      );
    } else if (
      this._utilities.currentProfile?.type === 'page' &&
      (this.connetionType === 'companyQueue' ||
        this.connetionType === 'companyUnfollowed')
    ) {
      this.feildsHeaderData.push(
        { label: 'Name' },
        { label: 'Campaign Name' },
        { label: 'Occupation' }
      );
    }

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

    //this.getProspectList();

    // Check DiscoverEmail

    this._utilities.refreshDiscoverEmail = new Subject();
    this._utilities.refreshDiscoverEmail.subscribe((response: any) => {
      console.log('response email=>>', response);

      let connectionId = response?.data?._id;
      if (connectionId && response?.data?.enrowEmail) {
        let filterArray = this.prospectData?.filter(
          (x: any) => x?._id == connectionId
        );
        if (filterArray?.length > 0) {
          filterArray[0].enrowEmail = response?.data?.enrowEmail;
          filterArray[0].enrowEmailStatus = response?.data?.enrowEmailStatus;
          this.openEmailDialog(filterArray[0]);
        }
      } else {
        this.toastr.error('Faild to fetch discover email');
        return;
      }
    });
  }

  // Add Class in Closet td

  toggleDropClass(event: Event): void {
    const allTdElements = document.querySelectorAll('td.ide-cust-class');
    allTdElements.forEach((td) => td.classList.remove('ide-cust-class'));

    const target = event.target as HTMLElement;
    this.tdElement = target.closest('td');
    if (this.tdElement) {
      this.tdElement.classList.toggle('ide-cust-class');
    }
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
      campaignId: this.activeCampaignId,
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

  // Discover email

  openEmailDialog(userData: any) {
    if (this.tdElement) {
      this.tdElement.classList.remove('ide-cust-class');
    }

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

  // Remove Prospecting

  removeProspecting(prospectId: any) {
    if (this.tdElement) {
      this.tdElement.classList.remove('ide-cust-class');
    }
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
}
