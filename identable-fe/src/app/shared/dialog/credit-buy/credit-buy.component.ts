import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { BillingService } from '../../../providers/billing/billing.service';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
@Component({
  selector: 'app-credit-buy',
  templateUrl: './credit-buy.component.html',
  styleUrls: ['./credit-buy.component.scss'],
})
export class CreditBuyComponent {
  constructor(
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private _billingService: BillingService,
    private router: Router
  ) {
    let currentUrl = this.router.url;
    localStorage.setItem('currentUrl', currentUrl);
  }

  buyCredit(amount: any) {
    let obj = {
      credit: amount,
      successUrl: 'http://localhost:6500/billing/buycreditsuccess',
      cancelUrl: 'http://localhost:6500/billing/buycreditsuccess',
    };
    this.loaderService.start();
    this._billingService.buyCredit(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          window.location.href = response?.data;
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      }
    );
  }
}
