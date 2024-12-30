import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { CarouselService } from '../../../providers/carousel/carousel.service';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-carousel-template-list',
  templateUrl: './carousel-template-list.component.html',
  styleUrls: ['./carousel-template-list.component.scss'],
})
export class CarouselTemplateListComponent {
  carouselThemeData: any;
  selectedTheme: any;
  isSubmtted: boolean = false;
  constructor(
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    private _carouselService: CarouselService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CarouselTemplateListComponent>
  ) {}

  ngOnInit(): void {
    this.getCarousel();
  }
  getCarousel() {
    let obj = {};
    this.loaderService.start();
    this._carouselService.getCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this.carouselThemeData = response?.data;
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

  close() {
    this.dialogRef.close('');
  }

  selectTheme(theme: any) {
    this.selectedTheme = theme;
  }

  submit() {
    this.isSubmtted = true;
    if (!this.selectedTheme) {
      return;
    }

    this.dialogRef.close({ theme: this.selectedTheme });
  }
}
