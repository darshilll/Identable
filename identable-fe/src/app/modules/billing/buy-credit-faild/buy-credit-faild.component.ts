import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../providers/loader-service/loader.service';
@Component({
  selector: 'app-buy-credit-faild',
  templateUrl: './buy-credit-faild.component.html',
  styleUrls: ['./buy-credit-faild.component.scss'],
})
export class BuyCreditFaildComponent {
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

    this._toastr.error('Oops! The credit purchase failed. Please try again');
    this.router.navigate([storedUrl]);
  }
}
