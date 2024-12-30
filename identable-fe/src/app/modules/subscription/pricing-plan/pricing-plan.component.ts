import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { PlanService } from '../../../providers/plan/plan.service';
import { BillingService } from '../../../providers/billing/billing.service';

// COMPONENTS
import { UpgradePlanComponent } from '../../../shared/dialog/upgrade-plan/upgrade-plan.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-pricing-plan',
  templateUrl: './pricing-plan.component.html',
  styleUrls: ['./pricing-plan.component.scss'],
})
export class PricingPlanComponent {
  recurringType: string = 'Yearly';

  dialogRef: any;
  constructor(
    private router: Router,
    public _planService: PlanService,
    public _billingService: BillingService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    private _dialog: MatDialog,
    public _globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.initView();
  }
  async initView() {
    await this._globalService.getUserDetails({ isRefresh: true });

    if (this._utilities.userData?.subscription?.subscriptionStatus != 'trial') {
      if (this._utilities.userData?.subscription?.recurringType == 'Monthly') {
        this.recurringType = 'Monthly';
      }
      if (this._utilities.userData?.subscription?.recurringType == 'Yearly') {
        this.recurringType = 'Yearly';
      }
    }
  }
  onChangeRecurringType(recurringType: any) {
    this.recurringType = recurringType;
  }

  upgradePlan() {
    this.dialogRef = this._dialog.open(UpgradePlanComponent, {
      width: '500px',
      //panelClass: 'custom-edit-post-modal',
      data: {},
    });
  }

  onGetStarted(planId: string) {
    let param = {
      planId: planId,
      recurringType: this.recurringType,
    };

    this.loaderService.start();
    this._billingService.checkoutSession(param).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          window.location.href = response?.data;
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

  logout() {
    this._utilities.logout();
  }

  getPopularDiv(planId: string) {
    if (this._utilities.userData?.subscription?.subscriptionStatus == 'trial') {
      if (planId == this._utilities.PLAN.YOUR_GROWING) {
        return 'populardiv';
      }
      return '';
    }

    if (planId == this._utilities.userData?.subscription?.planId) {
      return 'populardiv';
    }

    return '';
  }

  isShowPopular() {
    if (this._utilities.userData?.subscription?.subscriptionStatus == 'trial') {
      return true;
    }
    return false;
  }

  isShowCurrent(planId: string) {
    if (this._utilities.userData?.subscription?.subscriptionStatus == 'trial') {
      return false;
    }

    if (planId == this._utilities.userData?.subscription?.planId) {
      return true;
    }
    return false;
  }
}
