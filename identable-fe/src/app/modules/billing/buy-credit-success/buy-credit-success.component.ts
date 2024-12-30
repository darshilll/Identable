import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../providers/loader-service/loader.service';
@Component({
  selector: 'app-buy-credit-success',
  templateUrl: './buy-credit-success.component.html',
  styleUrls: ['./buy-credit-success.component.scss'],
})
export class BuyCreditSuccessComponent {
  constructor(
    private router: Router,
    private _toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    this.loaderService.start();
    const storedUrl = localStorage.getItem('currentUrl')
      ? localStorage.getItem('currentUrl')
      : 'dashboard';
    localStorage.removeItem('currentUrl');
    this.loaderService.stop();
    this._toastr.success('Credits purchased successfully!');
    this.router.navigate([storedUrl]);
  }
}
