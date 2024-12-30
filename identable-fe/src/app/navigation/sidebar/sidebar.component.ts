import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//UTILS
import { CommonFunctionsService } from '../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../utils/common-functions/global.service';
import { commonConstant } from '../../utils/common-functions/common-constant';

// COMPONENTS
import { EditLinkedinPostComponent } from '../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  oneClickDialogRef: any;
  activeTab: any = '';
  currentProfile: any;
  dialogRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      if (segments.length > 1) {
        const pathAfterHost = segments.slice(2).join('/');
        this.activeMenu(pathAfterHost);
      }
    });
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.setCurrentProfileData();
  }

  onMouseEnter(): void {
    document.body.classList.remove('open_sidebar');
  }

  onMouseLeave(): void {
    document.body.classList.add('open_sidebar');
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  sidebarToggle() {
    var body = document.getElementsByTagName('BODY')[0];
    body.classList.toggle('open_sidebar');
  }

  activeMenu(expectedPath: any) {
    const { pathname } = window.location;
    return pathname.includes(expectedPath);
  }

  openEditPost() {
    let payload = {};
    payload = {
      ...payload,
      currentProfile: this.currentProfile,
      isGeneratePost: true,
      generatedType: commonConstant.POSTGENERATETYPE.DIY_STRATEGY,
    };

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      data: payload,
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
