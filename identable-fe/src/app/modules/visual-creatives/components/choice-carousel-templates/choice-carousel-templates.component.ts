import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//COMPONENT
import { CarouselTemplatePreviewComponent } from '../../../../shared/dialog/carousel-template-preview/carousel-template-preview.component';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { CarouselService } from '../../../../providers/carousel/carousel.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { designControl } from '../../../../utils/carousel-control/design-control';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-choice-carousel-templates',
  templateUrl: './choice-carousel-templates.component.html',
  styleUrls: ['./choice-carousel-templates.component.scss'],
})
export class ChoiceCarouselTemplatesComponent {
  // Templates
  carouselTemplates: any;
  choiceTemplatesId: any = 'template1';
  currentContent: any;
  carouselName: any;
  carouselIdea: any;
  carouselLength: any;
  themeType: any;

  // Dialog Option
  tempDialogRef: any;

  // Template Id Manage
  currentTemplateId: any;
  newTemplateId: any;
  isEditable: boolean = false;
  carouselId: any;
  constructor(
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    private _carouselService: CarouselService,
    private carouselTemplatesService: CarouselTemplatesService,
    private designControlService: DesignControlService
  ) {
    this.designControlService.aiIdeanContent$.subscribe((data) => {
      this.currentTemplateId = data?.choiceTemplatesId;
      this.choiceTemplatesId = data?.choiceTemplatesId;
      this.currentContent = data?.content;
      this.themeType = data?.themeType;
      this.carouselName = data?.carouselName;
      this.isEditable = data?.isEditable;
    });

    this.fetchCarouselTemplates();
    // Get the template by ID
    this.carouselId = this.route.snapshot.params['id'];
    console.log("this.isEditable ", this.isEditable);
    if (this.carouselId) {
      this.isEditable = true;
    }
    console.log("this.isEditable FInd", this.isEditable);
  }

  // Choice template

  choiceNewTemplate(item: any) {
    console.log("hello test",item);
    this.newTemplateId = item?.templateId;

    let getCurrentContent: any =
      this.carouselTemplatesService.getTemplateById(
        designControl?.defaultTemplate
      );

    this.currentContent =
      this.currentContent?.length > 0
        ? this.currentContent
        : getCurrentContent?.slides;

    if (this.currentTemplateId != this.newTemplateId && this.newTemplateId) {
      this.designControlService.setCarouselIdeaContent({
        choiceTemplatesId: this.newTemplateId,
        themeType: this.themeType,
        content: this.currentContent,
        carouselName: this.carouselName,
        carouselIdea: this.carouselIdea,
        carouselLength: this.carouselLength,
        genratedType: 'template',
        isGenratedFirst: true,
        isEditable: this.isEditable,
      });
    }
  }

  // Preview Templates

  previewTemplate(item: any) {
    this.tempDialogRef = this._dialog.open(CarouselTemplatePreviewComponent, {
      width: '1200px',
      disableClose: false,
      panelClass: 'custom-carousels-modal',
      data: {
        item: item,
      },
    });
    this.tempDialogRef.afterClosed().subscribe((result: any) => {

      console.log("result", result);
      if (result && result != undefined) {
        this.newTemplateId = result;
      }

      console.log("this.newTemplateId", this.newTemplateId);

      let getCurrentContent: any =
        this.carouselTemplatesService.getTemplateById(
          designControl?.defaultTemplate
        );

      this.currentContent =
        this.currentContent?.length > 0
          ? this.currentContent
          : getCurrentContent?.slides;

      console.log('this.currentContent', this.currentContent);

      if (this.currentTemplateId != this.newTemplateId && this.newTemplateId) {
        this.designControlService.setCarouselIdeaContent({
          choiceTemplatesId: this.newTemplateId,
          themeType: this.themeType,
          content: this.currentContent,
          carouselName: this.carouselName,
          carouselIdea: this.carouselIdea,
          carouselLength: this.carouselLength,
          genratedType: 'template',
          isGenratedFirst: true,
          isEditable: this.isEditable,
        });
      }
    });
  }

  fetchCarouselTemplates() {
    let obj = {};
    this._loader.start();
    this._carouselService.getCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.carouselTemplateArray = response?.data;
          this.carouselTemplates = response?.data;
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
    //this.carouselTemplates = this.carouselTemplatesService.getAllTemplate();
  }
}
