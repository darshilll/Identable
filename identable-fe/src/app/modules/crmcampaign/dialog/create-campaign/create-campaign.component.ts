import { Component, ChangeDetectorRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

//services
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CrmCampaignService } from '../../../../providers/crm-campaign/crm-campaign.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
})
export class CreateCampaignComponent {
  campaignType: any;
  currentStep: number = 1;
  direction: any;
  isAllowNext: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<CreateCampaignComponent>,
    public cdr: ChangeDetectorRef,
    private _loader: LoaderService,
    private crmCampaignService: CrmCampaignService,
    private _toastr: ToastrService,
  ) {}

  selectCampaignType(campaignType: any) {
    this.campaignType = campaignType;
    this.isAllowNext = true;
  }

  nextStep(direction: boolean) {
    if (direction) {
      this.currentStep++;
    } else {
      if (this.currentStep == 1) {
        this.campaignType = '';
        return;
      }
      this.currentStep--;
    }
  }

  back(event: any) {
    if (event?.currentStep) {
      this.currentStep = event?.currentStep;
    } else {
      this.campaignType = '';
    }
    this.cdr.detectChanges();
  }

  notAllowContinue(event: any) {
    if (event?.notAllowNext) {
      this.isAllowNext = false;
    }
    this.cdr.detectChanges();
  }

  createCampaign(event: any) {
    console.log('---------------', event);
    if (this.campaignType === 'profile') {
      this._loader.start();
      this.crmCampaignService.saveCampaign(event).subscribe(
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

    } else {

      this._loader.start();
      this.crmCampaignService.saveCompanyCampaign(event).subscribe(
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
  }
}
