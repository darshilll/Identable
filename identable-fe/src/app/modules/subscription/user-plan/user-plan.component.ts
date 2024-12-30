import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { UserService } from '../../../providers/user/user.service';
import { BillingService } from '../../../providers/billing/billing.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-user-plan',
  templateUrl: './user-plan.component.html',
  styleUrls: ['./user-plan.component.scss'],
})
export class UserPlanComponent {
  constructor(
    private router: Router,
    private _userService: UserService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    public _billingService: BillingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({});
    this.setView();
  }

  setView() {}

  logout() {
    this._utilities.logout();
  }

  onPayNow() {}

  manageSubscription() {
    let param = {
      planId: this._utilities.userData?.subscription?.planId,
      recurringType: this._utilities.userData?.subscription?.recurringType,
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
}
