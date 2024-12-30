import { Component, Inject, OnInit } from '@angular/core';
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
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { MiscellaneousConstant } from '../../../utils/common-functions/miscellaneous-constant';
@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.scss'],
})
export class CampaignInfoComponent {
  isStepOne: boolean = true;
  isStepTwo: boolean = false;

  campaignForm: FormGroup;
  submittedCampaign: boolean = false;

  campaignSettingForm: FormGroup;
  submittedCampaignSetting: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CampaignInfoComponent>,
    public _utilities: CommonFunctionsService,
    private crmCampaignService: CrmCampaignService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private fb: FormBuilder
  ) {
    this.campaignForm = this.fb.group({
      campaignType: [1, Validators.required],
      campaignName: ['', Validators.required],
      linkedInUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(MiscellaneousConstant.linkedinPattern),
        ],
      ],
    });

    this.campaignSettingForm = this.fb.group({
      isPremiumAccount: [false, Validators.required],
      isInMailDiscover: [false, Validators.required],
      isAlreadyTalkedPeople: [false, Validators.required],
    });
  }

  ngOnInit(): void {}

  public hasError = (controlName: string, errorName: string) => {
    return this.campaignForm.controls[controlName].hasError(errorName);
  };

  public settingHasError = (controlName: string, errorName: string) => {
    return this.campaignSettingForm.controls[controlName].hasError(errorName);
  };

  nextStep(direction: boolean) {
    if (direction) {
      if (this.isStepOne) {
        this.submittedCampaign = true;
        if (!this.campaignForm.valid) {
          return;
        }
        this.isStepOne = false;
        this.isStepTwo = true;
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
    let { campaignName, linkedInUrl, campaignType } = this.campaignForm.value;
    let { isAlreadyTalkedPeople, isInMailDiscover, isPremiumAccount } =
      this.campaignSettingForm.value;

    let obj = {
      campaignType: campaignType,
      campaignName: campaignName,
      searchUrl: linkedInUrl,
      isPremiumAccount: isInMailDiscover,
      isInMailDiscover: isInMailDiscover,
      isAlreadyTalkedPeople: isAlreadyTalkedPeople,
    };

    this._loader.start();
    this.crmCampaignService.saveCampaign(obj).subscribe(
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
  }

  checkCampaingType() {
    return this.campaignForm?.get('campaignType')?.value;
  }
}
