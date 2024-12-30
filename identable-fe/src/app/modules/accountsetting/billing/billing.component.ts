import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { BillingService } from '../../../providers/billing/billing.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  @Output() onSubmitBillingSetting = new EventEmitter();

  constructor(
    public _userService: UserService,
    public _billingService: BillingService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    if (!this._utilities.userData?.isBilling) {
      this.updateAccountSettingFlag();
    }
  }

  saveContinue() {
    this.onSubmitBillingSetting.emit();
  }

  movedToPlan() {
    window.open('/subscription/plan', '_blank');
  }

  calculateDateDiff(planDate: any) {
    var date1: any = new Date(planDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getPlanPrice() {
    if (this._utilities.userData?.subscription?.recurringType == 'Monthly') {
      return `$${this._utilities.userData?.plan?.monthlyPriceUSD} per month`;
    }
    return `$${this._utilities.userData?.plan?.yearlyPriceUSD} per year`;
  }

  updateAccountSettingFlag() {
    let obj = { isBilling: true };

    this.loaderService.start();
    this._userService.updateAccountSettingFlag(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.userData.isBilling = true;
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

  onCancelSubscription() {
    this.loaderService.start();
    this._billingService.manageSubscription({}).subscribe(
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
}
