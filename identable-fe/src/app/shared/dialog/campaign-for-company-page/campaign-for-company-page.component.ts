import { Component, Inject, OnInit,ChangeDetectorRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//services
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CrmCampaignService } from '../../../providers/crm-campaign/crm-campaign.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-campaign-for-company-page',
  templateUrl: './campaign-for-company-page.component.html',
  styleUrls: ['./campaign-for-company-page.component.scss']
})
export class CampaignForCompanyPageComponent {

  // Connected user list
  items: any[] = [];
  selectedFollower: any = [];
  
  campaignForm: FormGroup;
  submittedCampaign: boolean = false;

  isStepOne: boolean = true;
  isStepTwo: boolean = false;

  // Pagignation Page
  searchText: any;
  currentPage: number = 1;
  totalRecord: number = 0;
  creditDeducated: number = 0;
  creditMessage: any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CampaignForCompanyPageComponent>,
    public _utilities: CommonFunctionsService,
    private crmCampaignService: CrmCampaignService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private fb: FormBuilder,
    public  cdr: ChangeDetectorRef
  ){
    this.campaignForm = this.fb.group({
      campaignName: ['', Validators.required],
    });

    this.creditDeducated = 10; //this._utilities?.creditDeduction?.searchNewsCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  ngOnInit() {
    
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.campaignForm.controls[controlName].hasError(errorName);
  };

  // Second Tab Connection

  onScrollDown() {
    const totalPage = Math.ceil(this.totalRecord / 10);
    if (this.currentPage < totalPage) {
      this.currentPage++;
      this.getConnectedList();
    }
  }

  searchFollower(event: any) {
    this.searchText = event.target.value;
    this.items = [];
    this.currentPage = 1;
    this.getConnectedList();
  }

  getConnectedList() {
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

    this._loader.start();
    this.crmCampaignService.getConnectedList(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let newData = response.data?.items;
          this.totalRecord = response.data?.count;
          this.items = [...this.items, ...newData];
          this.cdr.detectChanges();
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

  selectFollower(event: any) {
    let isChecked = event.target.checked;
    let value = event.target.value;

    if (isChecked && this.selectedFollower?.length >= 10) {
      this._toastr.error(
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

  nextStep(direction: boolean) {
    if (direction) {
      if (this.isStepOne) {
        this.submittedCampaign = true;
        if (!this.campaignForm.valid) {
          return;
        }
        this.isStepOne = false;
        this.isStepTwo = true;
        this.getConnectedList();
      } else {
        this.save();
      }
    } else {
      this.isStepOne = true;
      this.isStepTwo = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    let { campaignName} = this.campaignForm.value;
    
    let obj = {
      campaignName: campaignName,
      connectedIds: this.selectedFollower
    };

    if(this.selectedFollower?.length == 0)
    {
      this._toastr.error("Please select connections");
      return;
    }

    this._loader.start();
    this.crmCampaignService.saveCompanyCampaign(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._toastr.success(response?.data);
          this.dialogRef.close(true);
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

    console.log("obj",obj);
  }

}
