import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CrmCampaignService } from '../../../providers/crm-campaign/crm-campaign.service';

// COMPONENTS
import { CampaignInfoComponent } from '../../../shared/dialog/campaign-info/campaign-info.component';
import { CampaignForCompanyPageComponent } from '../../../shared/dialog/campaign-for-company-page/campaign-for-company-page.component';
import { CreateCampaignComponent } from '../dialog/create-campaign/create-campaign.component';
import { ProfileCreateCampaignComponent } from '../dialog/profile-create-campaign/profile-create-campaign.component';
import { CompanyPageCreateCampaignComponent } from '../dialog/company-page-create-campaign/company-page-create-campaign.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
})
export class CRMComponent {
  dialogRef: any;
  selectedCampaignFilter: any = 'All Campaign';
  showTabs: boolean = false;
  crmTabs: any[] = [];

  openCampaign: boolean = false;

  // Assign Post Data
  campaignInData: any[] = [];
  filterCampaignList: any[] = [];

  mainCampaignData: any[] = [];
  fetchCampaignData: any[] = [];

  campaignSortOrder: 'asc' | 'desc' = 'asc';

  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;
  nextJobTime: string = '';
  processingCampaign: any = null;

  searchDataForm: FormGroup = this.formBuilder.group({ searchText: [''] });
  searchCampaignForm: FormGroup = this.formBuilder.group({ searchText: [''] });

  activeCampaignData: any;
  activeCampaignId: any;
  allCampaignData: any;
  constructor(
    private crmCampaignService: CrmCampaignService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    private router: Router,
    public _globalService: GlobalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initView();
    //this.startCampaign();
  }

  async initView() {
    console.log('Hello', this._utilities);
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    if (!this._utilities.userData?.isAllowCRM) {
      this.toastr.error('Permission Denied', '');
      this.router.navigate(['dashboard']);
    }

    this._utilities.refreshProspectData = new Subject();
    this._utilities.refreshProspectData.subscribe((response: any) => {
      console.log('refreshProspectData response = ', response);

      if (response?.data?.count >= 800) {
        this.processingCampaign = null;
      }
      if (response?.data?.count <= 20) {
        this.onListAction(this.crmTabs[1]);
      }
      this._utilities.refreshProspectList.next({ status: true });
    });

    this.getProcessingCampaign();
    this.getCampaignList();
    this.getCampaignData();
  }

  startCampaign() {
    this.dialogRef = this._dialog.open(CreateCampaignComponent, {
      width: '960px',
      disableClose: false,
      panelClass: 'custom-create-camp-modal',
      data: {},
    });

    // if(this._utilities.currentProfile?.type === 'page')
    // {
    //   this.dialogRef = this._dialog.open(CampaignForCompanyPageComponent, {
    //     width: '740px',
    //     data: {},
    //   });
    // }
    // else
    // {
    //   this.dialogRef = this._dialog.open(CampaignInfoComponent, {
    //     width: '940px',
    //     data: {},
    //   });
    // }

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        //this.viewCampaign(true);
        this.getProcessingCampaign();
        this.getCampaignList();
        this.getCampaignData();
      }
    });
  }

  viewCampaign(bool: any) {
    this.openCampaign = !this.openCampaign;
    if (bool) {
      this.getCampaignData();
    }
  }

  onListAction(listTabs: any) {
    for (let i = 0; i < this.crmTabs.length; i++) {
      this.crmTabs[i].isOpen = false;
    }
    listTabs.isOpen = true;
  }

  getProcessingCampaign() {
    let param = {};

    this.crmCampaignService.getProcessingCampaign(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.processingCampaign = response?.data;
        }
      },
      (err: ErrorModel) => {}
    );
  }

  getCampaignList() {
    let param = {};
    this.loaderService.start();
    this.crmCampaignService.getCampaignList(param).subscribe(
      (response: ResponseModel) => {
        //this.loaderService.stop();

        if (response.statusCode == 200) {
          this.filterCampaignList = response?.data;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        //this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getCampaignData() {
    let param = {};

    //this.loaderService.start();

    if (this._utilities.currentProfile?.type === 'page') {
      param = {
        ...param,
        currentPageId: this._utilities.currentProfile._id,
      };
      this.crmCampaignService.getCompanyCampaignData(param).subscribe(
        (response: ResponseModel) => {
          this.loaderService.stop();

          if (response.statusCode == 200) {
            this.mainCampaignData = response?.data?.campaignData;
            this.fetchCampaignData = this.mainCampaignData;
            this.allCampaignData = response?.data?.prospectsData;
            this.nextJobTime = response?.data?.nextJobTime;
            this.setupTabs(this.allCampaignData, 'all');
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
    } else {
      this.crmCampaignService.getCampaignData(param).subscribe(
        (response: ResponseModel) => {
          this.loaderService.stop();

          if (response.statusCode == 200) {
            this.mainCampaignData = response?.data?.campaignData;
            this.fetchCampaignData = this.mainCampaignData;
            this.allCampaignData = response?.data?.prospectsData;
            this.nextJobTime = response?.data?.nextJobTime;
            this.setupTabs(this.allCampaignData, 'all');
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

  setupTabs(fetchCampaignData: any, type: any) {
    let campaignCount;
    if (type === 'all') {
      campaignCount = fetchCampaignData;
    } else {
      campaignCount = fetchCampaignData;
    }
    if (this._utilities.currentProfile?.type === 'page') {
      console.log('campaignCount', campaignCount);
      this.crmTabs = [
        {
          label: 'Followers',
          isOpen: true,
          count: campaignCount?.followerCount,
        },
        {
          label: 'Prospecting',
          isOpen: false,
          count: campaignCount?.prospectCount,
        },
        {
          label: 'Warming Up',
          isOpen: false,
          count: campaignCount?.warmingUpCount,
        },
        {
          label: 'Connected',
          isOpen: false,
          count: campaignCount?.connectedCount,
        },
        {
          label: 'Queue',
          isOpen: false,
          count: campaignCount?.queueCount,
        },
        {
          label: 'Follow Request',
          isOpen: false,
          count: campaignCount?.followingCount,
        },
        {
          label: 'Unfollowed',
          isOpen: false,
          count: campaignCount?.unfollowedCount,
        },
      ];
    } else {
      this.crmTabs = [
        {
          label: 'Connected',
          isOpen: true,
          count: campaignCount?.connectedCount,
        },
        {
          label: 'Prospecting',
          isOpen: false,
          count: campaignCount?.prospectCount,
        },
        {
          label: 'Warming Up',
          isOpen: false,
          count: campaignCount?.warmingUpCount,
        },
        {
          label: 'Following',
          isOpen: false,
          count: campaignCount?.followedCount,
        },
        {
          label: 'Connecting',
          isOpen: false,
          count: campaignCount?.connectingCount,
        },
        {
          label: 'Ignored',
          isOpen: false,
          count: campaignCount?.ignoredCount,
        },
        {
          label: 'Dropped',
          isOpen: false,
          count: campaignCount?.droppedCount,
        },
      ];
    }
  }

  selectCampaign(data: any, type: any) {
    this.activeCampaignData = type != 'all' ? data : '';
    this.activeCampaignId = type != 'all' ? data._id : null;
    this.setupTabs(data, type);
  }

  updateCampaignStatus(event: any, campaignId: any) {
    let isChecked = event.target.checked;
    let param = {
      campaignId: campaignId,
      isActive: isChecked,
    };
    this.loaderService.start();
    this.crmCampaignService.updateCampaignStatus(param).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this.toastr.success(response?.data);
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

  getAcceptanceRate(listData: any) {
    let per = 0;
    if (listData?.connectedCount > 0 && listData?.count > 0) {
      per = (listData?.connectedCount * 100) / listData?.count;
    }

    return per?.toFixed(2) + '%';
  }

  searchConnection() {
    let searchVal = '';
    if (this.searchDataForm.value.searchText) {
      searchVal = this.searchDataForm.value.searchText;
    }
    this._utilities.prospectSearchText = searchVal;
    this._utilities.refreshProspects.next({});
  }

  clearConnectionSearchText() {
    this.searchDataForm.get('searchText')?.setValue('');
    this._utilities.prospectSearchText = '';
    this._utilities.refreshProspects.next({});
  }

  searchCampaign() {
    let searchVal = '';
    if (this.searchCampaignForm.value.searchText) {
      searchVal = this.searchCampaignForm.value.searchText;
    }

    if (!searchVal) {
      this.fetchCampaignData = this.mainCampaignData;
    } else {
      let filterArray = this.mainCampaignData?.filter((x: any) =>
        x?.campaignName.toLowerCase()?.includes(searchVal?.toLowerCase())
      );

      this.fetchCampaignData = filterArray;
    }
  }

  clearCampaignSearchText() {
    this.searchCampaignForm.get('searchText')?.setValue('');
    this.searchCampaign();
  }

  campaignToggleSortOrder() {
    // Toggle sort order
    this.campaignSortOrder = this.campaignSortOrder === 'asc' ? 'desc' : 'asc';

    // Sort the fetchCampaignData array
    this.fetchCampaignData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return this.campaignSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Update the image based on sort order
    const sortingImage = document.querySelector(
      'img[id="camp-shorting"]'
    ) as HTMLImageElement;
    if (sortingImage) {
      sortingImage.src =
        this.campaignSortOrder === 'asc'
          ? 'assets/images/icons/sorting-down.svg'
          : 'assets/images/icons/sorting-up.svg';
    }
  }

  getProcessingStatusClass(connectionType: any, listData: any) {
    if (listData?.count == 0) {
      return 'cam-secondary';
    }

    if (this._utilities.currentProfile?.type === 'profile') {
      if (connectionType == 'prospecting') {
        if (listData?.prospectCount == 0) {
          return 'cam-green';
        }
        if (listData?.prospectCount > 0) {
          return 'cam-orange';
        }
      } else if (connectionType == 'warmingUp') {
        if (listData?.prospectCount == 0 && listData?.warmingUpCount == 0) {
          return 'cam-green';
        }
        if (listData?.warmingUpCount > 0) {
          return 'cam-orange';
        }
      } else if (connectionType == 'following') {
        if (
          listData?.prospectCount == 0 &&
          listData?.warmingUpCount == 0 &&
          listData?.followedCount == 0
        ) {
          return 'cam-green';
        }
        if (listData?.followedCount > 0) {
          return 'cam-orange';
        }
      } else if (connectionType == 'connecting') {
        if (
          listData?.prospectCount == 0 &&
          listData?.warmingUpCount == 0 &&
          listData?.followedCount == 0 &&
          listData?.connectingCount == 0
        ) {
          return 'cam-green';
        }
        if (listData?.connectingCount > 0) {
          return 'cam-orange';
        }
      } else if (connectionType == 'connected') {
        if (
          listData?.prospectCount == 0 &&
          listData?.warmingUpCount == 0 &&
          listData?.followedCount == 0 &&
          listData?.connectingCount == 0 &&
          listData?.connectedCount == 0
        ) {
          return 'cam-green';
        }

        if (listData?.connectedCount > 0) {
          return 'cam-orange';
        }
      }
    }

    if (this._utilities.currentProfile?.type === 'page') {
      if (connectionType == 'company_following') {
        if (listData?.followingCount == 0) {
          return 'cam-green';
        }
        if (listData?.followingCount > 0) {
          return 'cam-orange';
        }
      } else if (connectionType == 'company_followed') {
        if (listData?.followedCount == 0) {
          return 'cam-green';
        }
        if (listData?.followedCount > 0) {
          return 'cam-orange';
        }
      }
    }

    return 'cam-secondary';
  }

  selectCampaignFilter(campaignId?: any) {
    let campaign = this.filterCampaignList.find(
      (x: any) => x?._id == campaignId
    );
    if (campaignId) {
      this.selectedCampaignFilter = campaign?.campaignName;
    } else {
      this.selectedCampaignFilter = 'All Campaign';
    }

    this._utilities.prospectCampaignId = campaignId;
    this._utilities.refreshProspects.next({});
  }
}
