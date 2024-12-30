import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

// COMPONENTS
import { CarouselTemplatesComponent } from '../dialog/carousel-templates/carousel-templates.component';
import { AdCreativeTemplatesComponent } from '../dialog/ad-creative-templates/ad-creative-templates.component';
import { DeleteCarouselConformationComponent } from '../../../shared/common/delete-carousel-conformation/delete-carousel-conformation.component';

// Library
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';
import { AdCreativeService } from 'src/app/providers/adCreative/ad-creative.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { commonConstant } from '../../../utils/common-functions/common-constant';

@Component({
  selector: 'app-creative-options',
  templateUrl: './creative-options.component.html',
  styleUrls: ['./creative-options.component.scss'],
})
export class CreativeOptionsComponent {
  commonConstant: any = commonConstant;
  dialogRef: any;
  savedTemplate: any;
  selectTemplateId: any;
  searchText: any;
  sortMode: boolean = false;
  customeAdCreativeTemplate: any;
  activeTabLabel: any;
  allTemplate: any;
  constructor(
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _carouselService: CarouselService,
    private router: Router,
    public _adCreative: AdCreativeService
  ) {}

  ngOnInit() {
    this.getCustomTemplate();
  }

  createCarousel() {
    this.dialogRef = this._dialog.open(CarouselTemplatesComponent, {
      width: '1280px',
      disableClose: false,
      panelClass: 'custom-choice-carousel-modal',
      data: { isTemplates: false },
    });
  }

  // Create ad creative
  createAdCreative() {
    this.dialogRef = this._dialog.open(AdCreativeTemplatesComponent, {
      width: '1280px',
      disableClose: false,
      panelClass: 'custom-choice-carousel-modal',
      data: { isTemplates: false },
    });
  }

  getCustomTemplate() {
    this._loader.start();

    let obj = {};

    if (this.sortMode) {
      obj = {
        ...obj,
        sortMode: this.sortMode,
      };
    }

    if (this.searchText) {
      obj = {
        ...obj,
        searchText: this.searchText,
      };
    }

    this._carouselService.getAllCustomTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.savedTemplate = response.data;
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

  selectSaveTemplates(item: any) {
    if (
      item?.status == commonConstant.POSTSTATUS.SCHEDULED ||
      item?.status == commonConstant.POSTSTATUS.POSTED
    ) {
      return;
    }
    if (item?.status) {
      this.router.navigate(['/visual-creative/carousel/' + item?._id]);
    } else {
      this.router.navigate(['/visual-creative/adcreative/' + item?._id]);
    }
  }

  selectAdCreativeTemplate(item: any) {
    this.router.navigate(['/visual-creative/adcreative/' + item?._id]);
  }

  carouselsort() {
    this.sortMode = !this.sortMode;
    if (this.activeTabLabel == 'Ad creatives') {
      this.getCustomeAdCreativeTemplate();
    } else {
      this.getCustomTemplate();
    }
  }

  searchTemplate(event: any) {
    let text = event.target.value;
    this.searchText = text;
    if (this.activeTabLabel == 'Ad creatives') {
      this.getCustomeAdCreativeTemplate();
    } else {
      this.getCustomTemplate();
    }
  }

  clearSearchText() {
    this.searchText = '';
    if (this.activeTabLabel == 'Ad creatives') {
      this.getCustomeAdCreativeTemplate();
    } else {
      this.getCustomTemplate();
    }
  }

  deleteConfirmationDialog(tempId: any, type?: any) {
    this.dialogRef = this._dialog.open(DeleteCarouselConformationComponent, {
      width: '440px',
      data: { isAction: 'delete' },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result?.isAction == 'yes') {
          if (type == 'adCreative') {
            this.deleteAdcreativeTemplate(tempId);
          } else {
            this.deleteCarousel(tempId);
          }
        }
      }
    });
  }

  deleteCarousel(tempId: any) {
    this._loader.start();
    this._carouselService
      .deleteCustomTemplate({ templateId: tempId })
      .subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.getCustomTemplate();
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

  deleteAdcreativeTemplate(tempId: any) {
    this._loader.start();
    this._adCreative.deleteTemplate({ templateId: tempId }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.getCustomeAdCreativeTemplate();
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

  getCustomeAdCreativeTemplate() {
    this._loader.start();
    let obj = {};

    if (this.sortMode) {
      obj = {
        ...obj,
        sortMode: this.sortMode,
      };
    }

    if (this.searchText) {
      obj = {
        ...obj,
        searchText: this.searchText,
      };
    }

    this._adCreative.getAllTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let templates = response?.data;
          this.customeAdCreativeTemplate = templates;
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

  getvisualCreativesTemplate() {
    this._loader.start();
    let obj = {};

    if (this.sortMode) {
      obj = {
        ...obj,
        sortMode: this.sortMode,
      };
    }

    if (this.searchText) {
      obj = {
        ...obj,
        searchText: this.searchText,
      };
    }

    this._adCreative.getvisualCreativesTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let templates = response?.data;
          this.allTemplate = templates;
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

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabLabel = event.tab.textLabel;
    if (
      this.activeTabLabel == 'Ad creatives' &&
      !this.customeAdCreativeTemplate?.length
    ) {
      this.getCustomeAdCreativeTemplate();
    } else if (this.activeTabLabel == 'All' && !this.allTemplate?.length) {
      this.getvisualCreativesTemplate();
    }
  }
}
