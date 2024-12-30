import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-job-request-filter',
  templateUrl: './admin-job-request-filter.component.html',
  styleUrls: ['./admin-job-request-filter.component.scss'],
})
export class AdminJobRequestFilterComponent {
  jobTypeList: any = [
    'SCRAPE_ALL_POSTS',
    'SCRAPE_POST_PROSPECTS',
    'SCRAPE_POST_ANALYTICS',
    'SCRAPE_ALL_CONNECTIONS',
    'SCRAPE_INTEGRATION_DATA',
    'SCRAPE_ALL_COMPANY_FOLLOWERS',
    'SCRAPE_PROSPECTS',
    'INITIATE_LINKEDIN_INVITATIONS',
    'SCRAPE_ALL_FOLLOWERS',
    'SCRAPE_ADDITIONAL_PROFILE_DETAILS',
    'SCHEDULE_ARTICLE',
    'INITIATE_LINKEDIN_CONNECTIONS',
    'SCHEDULE_POST',
    'SCRAPE_SSI_DATA',
    'BOOST_POST',
    'SCRAPE_ALL_COMPANY_POSTS',
  ];
  selectedJobType: any = '';

  statusList: any = ['success', 'processing', 'failed'];
  selectedStatus: any = '';

  selectedTodate: any;
  selectedFromdate: any;

  toDate!: Date;
  fromDate!: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AdminJobRequestFilterComponent>
  ) {
    if (this.data?.jobType) {
      this.selectedJobType = this.data?.jobType;
    }
    if (this.data?.status) {
      this.selectedStatus = this.data?.status;
    }
    if (this.data?.fromDate) {
      this.fromDate = new Date(this.data?.fromDate);
    }
    if (this.data?.toDate) {
      this.toDate = new Date(this.data?.toDate);
    }
  }

  onSubmit(action: boolean) {
    if (!action) {
      this.dialogRef.close(false);
      return;
    }
    let filter = {};
    if (this.selectedJobType) {
      filter = {
        ...filter,
        jobType: this.selectedJobType,
      };
    }

    if (this.selectedStatus) {
      filter = {
        ...filter,
        status: this.selectedStatus,
      };
    }

    if (this.fromDate) {
      let fromDate = new Date(this.fromDate);
      filter = {
        ...filter,
        fromDate: fromDate.getTime(),
      };
    }

    if (this.toDate) {
      let toDate = new Date(this.toDate);
      filter = {
        ...filter,
        toDate: toDate.getTime(),
      };
    }

    this.dialogRef.close(filter);
  }

  selectJobType(type: any) {
    this.selectedJobType = type;
  }

  selectStatus(type: any) {
    this.selectedStatus = type;
  }
}
