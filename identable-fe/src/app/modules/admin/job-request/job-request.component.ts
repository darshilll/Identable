import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AdminService } from '../../../providers/admin/admin.service';

//COMPONENTS
import { AdminJobRequestFilterComponent } from '../../../shared/dialog/admin-job-request-filter/admin-job-request-filter.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
@Component({
  selector: 'app-job-request',
  templateUrl: './job-request.component.html',
  styleUrls: ['./job-request.component.scss'],
})
export class JobRequestComponent {
  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;
  jobRequestData: any[] = [];

  dialogRef: any;
  isFilter: any = {};

  isDataLoaded: boolean = false;

  constructor(
    private _titleService: Title,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _admin: AdminService,
    private _dialog: MatDialog
  ) {
    this._titleService.setTitle('Admin | Job Request');
    this.getJobRequestList();
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getJobRequestList();
  }

  getJobRequestList() {
    let param = {};
    param = {
      page: this.currentPage,
    };

    if (this.isFilter) {
      param = {
        ...param,
        ...this.isFilter,
      };
    }

    this._loader.start();
    this._admin.getJobRequestList(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        this.isDataLoaded = true;
        if (response.statusCode == 200) {
          let totalItems = response?.data?.count || 0;
          let pageSize = response?.data?.limit || 0;
          this.totalPages = Math.ceil(totalItems / pageSize);
          this.jobRequestData = response?.data?.items;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.isDataLoaded = true;
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

  restartJobRequest(index: any) {
    let data = this.jobRequestData[index];
    let param = {
      jobRequesteUrl: data?.jobResponseId,
    };

    this._loader.start();
    this._admin.restartJobRequest(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        this.isDataLoaded = true;
        if (response.statusCode == 200) {
          this._toastr.success(response.data, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.isDataLoaded = true;
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

  openFilterDailog() {
    this.dialogRef = this._dialog.open(AdminJobRequestFilterComponent, {
      width: '550px',
      data: this.isFilter,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.currentPage = 1;
        this.isFilter = result;
        this.getJobRequestList();
      }
    });
  }

  download(index: any) {
    let data = this.jobRequestData[index];

    if (data?.requestData) {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

}
