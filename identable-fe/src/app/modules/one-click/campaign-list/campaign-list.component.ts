import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { OneClickService } from '../../../providers/oneClick/one-click.service';
//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
})
export class CampaignListComponent {
  campaignList: any;
  constructor(
    private _titleService: Title,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _oneClick: OneClickService,
    private router: Router
  ) {
    this._titleService.setTitle('Identable | Content Autopilot');
    this.getCampaignList();
  }

  getCampaignList() {
    this._loader.start();
    this._oneClick.getOneClickCampaignList({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.campaignList = response?.data;
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

  getCampaign(id: any) {
    this.router.navigate(['oneclick/campaignscheduler'], {
      queryParams: { id: id },
    });
  }

  getCampaignBoostCredit(id: any) {
    this._loader.start();
    this._oneClick.getCampaignBoostCredit({ campaignId: id }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let boostCredit = response?.data?.credit;
          this.activeCampaignBoosting(id);
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

  activeCampaignBoosting(id: any) {
    this._loader.start();
    this._oneClick.activeCampaignBoosting({ campaignId: id }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._toastr.success(response?.data);
          let index = this.campaignList.findIndex((x: any) => x._id == id);

          this.campaignList[index].isBoostCampaign = true;
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
