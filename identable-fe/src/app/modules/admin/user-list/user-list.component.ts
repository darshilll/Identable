import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;
  userList: any[] = [];

  dialogRef: any;
  isFilter: any = {};

  isDataLoaded: boolean = false;

  searchUserForm: FormGroup = this.formBuilder.group({ searchText: [''] });

  constructor(
    private _titleService: Title,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _admin: AdminService,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this._titleService.setTitle('Admin | User');
    this.getUserList();
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getUserList();
  }

  getUserList() {
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
    this._admin.getUserList(param).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        this.isDataLoaded = true;
        if (response.statusCode == 200) {
          let totalItems = response?.data?.count || 0;
          let pageSize = response?.data?.limit || 0;
          this.totalPages = Math.ceil(totalItems / pageSize);
          this.userList = response?.data?.items;
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
    // this.dialogRef = this._dialog.open(AdminJobRequestFilterComponent, {
    //   width: '350px',
    //   data: {},
    // });
    // this.dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     this.currentPage = 1;
    //     this.isFilter = result;
    //     this.getUserList();
    //   }
    // });
  }

  searchUser() {
    if (this.searchUserForm.value.searchText) {      
      this.isFilter = {
        ...this.isFilter,
        searchText: this.searchUserForm.value.searchText,
      };
      this.currentPage = 1;
      this.getUserList();
    }else{
      delete this.isFilter.searchText
      this.getUserList();
    }
  }
}
