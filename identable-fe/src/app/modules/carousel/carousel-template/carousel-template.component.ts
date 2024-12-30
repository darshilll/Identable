import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';

//COMPONENT
import { ViewCarouselSlideComponent } from '../../../shared/dialog/view-carousel-slide/view-carousel-slide.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-carousel-template',
  templateUrl: './carousel-template.component.html',
  styleUrls: ['./carousel-template.component.scss'],
})
export class CarouselTemplateComponent {
  // Dialog Option
  dialogRef: any;

  constructor(
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService,
    private _carouselService: CarouselService,
    public _globalService: GlobalService,
    private _titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._titleService.setTitle('Identable | Carousel');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    this.getCarousel();
  }

  getCarousel() {
    let obj = {};
    this.loaderService.start();
    this._carouselService.getCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.carouselData = response?.data;
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

  onShowSlides(item: any) {
    this.dialogRef = this._dialog.open(ViewCarouselSlideComponent, {
      width: '1200px',
      disableClose: true,
      panelClass: 'custom-carousels-modal',
      data: {
        item: item,
      },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.onEdit(item);
      }
    });
  }

  onEdit(item: any) {
    this._utilities.selectedTheme = item;
    this.router.navigate(['/carousels/carousels-genrator']);
  }
}
