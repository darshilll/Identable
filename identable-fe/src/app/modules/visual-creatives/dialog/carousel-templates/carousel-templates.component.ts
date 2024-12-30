import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

//COMPONENT
import { CarouselTemplatePreviewComponent } from '../../../../shared/dialog/carousel-template-preview/carousel-template-preview.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { CarouselService } from '../../../../providers/carousel/carousel.service';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-carousel-templates',
  templateUrl: './carousel-templates.component.html',
  styleUrls: ['./carousel-templates.component.scss'],
})
export class CarouselTemplatesComponent {
  choiceCarouselForm: FormGroup;
  submitted: boolean = false;

  // Templates
  choiceTemplatesId: any = 'template1';

  // Genrated Idea
  genratedIdeaData: any;

  // Dialog Option
  tempDialogRef: any;
  ideaDialogRef: any;

  savedTemplate: any;
  carouselTemplate: any;
  selectTemplateId: any;

  selectedTabIndex = 1;
  genratedType: any = 'presets';
  selectedPresetsType: any = 'LinkedIn';

  // Tamplates Tabs
  activeTab: any = 'template';

  creditDeducated: number = 0;
  creditMessage: any;

  presetsListArray: any = [
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'LinkedIn',
      size: '1080 x1080 px',
      isComing: false,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'Instagram',
      size: '1080 x1080 px',
      isComing: true,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'facebook',
      size: '1080 x1080 px',
      isComing: true,
    },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    private _carouselService: CarouselService,
    private dialogRef: MatDialogRef<CarouselTemplatesComponent>,
    private formBuilder: FormBuilder,
    private carouselTemplatesService: CarouselTemplatesService,
    private _designControlService: DesignControlService,
    private router: Router
  ) {
    if (data?.choiceTemplatesId) {
      this.choiceTemplatesId = data?.choiceTemplatesId;
    }
    this.choiceCarouselForm = this.formBuilder.group({
      name: ['Untitled'],
      themeType: ['custom', Validators.required],
      carouselLength: [2, [Validators.required, Validators.max(10)]],
      carouselIdea: ['', Validators.required],
    });
    this.creditDeducated = this._utilities?.userData?.plan?.carouselCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
    this.fetchCarouselTemplates();
    this.getCustomTemplate();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.choiceCarouselForm.controls[controlName].hasError(errorName);
  };

  oneIdeaDailog() {
    let obj = { type: 'topic',title: 'Carousel idea' };

    this.ideaDialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.ideaDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.choiceCarouselForm.get('carouselIdea')?.setValue(result);     
      }
    });
  }

  carouselLengthCount(count: boolean) {
    const currentValue = this.choiceCarouselForm.get('carouselLength')?.value;

    if (count) {
      if (currentValue < 10) {
        this.choiceCarouselForm
          .get('carouselLength')
          ?.setValue(currentValue + 1);
      }
    } else {
      if (currentValue > 2) {
        this.choiceCarouselForm
          .get('carouselLength')
          ?.setValue(currentValue - 1);
      }
    }
  }

  changeTempTabs(tabs: any) {
    this.genratedType = tabs;
    this.choiceTemplatesId = '';
    if (tabs === 'savetemplate') {
      this._utilities.carouselTemplateArray = this.savedTemplate;
    } else {
      this._utilities.carouselTemplateArray = this.carouselTemplate;
    }
    this.activeTab = tabs;
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
    this.tempDialogRef.afterClosed().subscribe((result: any) => {});
  }

  // To Choice Templates

  selectTemplates(data: any, type: any) {
    if (type === 'savetemplate') {
      this.choiceTemplatesId = data?._id;
    } else {
      this.choiceTemplatesId = data?.templateId;
    }
    this.genratedType = type;
    this.selectedPresetsType = data?.type;
  }

  fetchCarouselTemplates() {
    let obj = {};
    this._loader.start();
    this._carouselService.getCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.carouselTemplate = response?.data;
          this._utilities.carouselTemplateArray = response?.data;
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

  genratePresetsTemplate() {
    this.submitted = true;
    if (this.choiceCarouselForm.invalid) {
      return;
    }
    let obj = {};
    this._loader.start();
    this._carouselService.getPresetCarouselTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          this._utilities.presetCarouselTemplateObject = response?.data;
          this.choiceTemplatesId = response?.data?.templateId;
          this.generateCarousel();
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

  generateCarousel() {
    this.submitted = true;
    if (this.choiceCarouselForm.invalid) {
      return;
    }
    if((this.genratedType === 'template' || this.genratedType == 'savetemplate') && !this.choiceTemplatesId)
    {
      this._toastr.error("Please choice template");
      return;
    }
    let obj = {
      slideLength: this.choiceCarouselForm.value.carouselLength,
      topic: this.choiceCarouselForm.value.carouselIdea,
    };
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._carouselService.createNewCarousel(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let carousel = response?.data;
          this._utilities.manageCredit(false, this.creditDeducated);
          if (!carousel || carousel?.length == 0) {
            this._toastr.error(MessageConstant.unknownError, '');
            return;
          }

          let newSlideArray = [];

          const formattedSlides = carousel.map(
            (item: any, index: any, array: any) => {
              let type = 'body_slide';

              if (index === 0) {
                type = 'starting_slide';
              } else if (index === array.length - 1) {
                type = 'ending_slide';
              }

              return {
                type: type,
                content: {
                  heading: item.main || item.heading || item?.footer,
                  sub_heading: item.mainsubtitle || '',
                  description: item.description || '',
                },
                isSldieVisible: true,
                showTitle: true,
                showSubTitle: !!item.mainsubtitle, // Show subtitle if it exists
                showDescription: !!item.description, // Show description if it exists
                showImage: false,
                showProfileShot: true,
                contentImage: '',
              };
            }
          );

          this._designControlService.setCarouselIdeaContent({
            choiceTemplatesId: this.choiceTemplatesId,
            themeType: this.choiceCarouselForm.value.themeType,
            content: formattedSlides,
            carouselName:
              this.choiceCarouselForm.value.carouselIdea.length > 12
                ? this.choiceCarouselForm.value.carouselIdea.substring(0, 12)
                : this.choiceCarouselForm.value.carouselIdea,
            carouselIdea: this.choiceCarouselForm.value.carouselIdea,
            carouselLength: this.choiceCarouselForm.value.carouselLength,
            genratedType: this.genratedType,
            isGenratedFirst: true,
            isEditable: false,
          });
          this.dialogRef.close();
          this.router.navigate(['/visual-creative/carousel']);
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

  createCarousel() {
    this.submitted = true;
    if (this.choiceCarouselForm.invalid) {
      return;
    }
    this.genratedIdeaData = [
      {
        type: 'starting_slide',
        content: {
          sub_heading: 'Unlock Success with Data Science!',
          heading:
            'How Data Science Revolutionizes Decision-Making in Business',
          description:
            "Data science isn't just a buzzword—it's a game changer. Discover how it's reshaping industries and driving growth!",
        },
        isSldieVisible: true,
        showTitle: true,
        showSubTitle: true,
        showDescription: true,
        showImage: false,
        showProfileShot: false,
        contentImage: '',
      },
      {
        type: 'body_slide',
        content: {
          heading: 'Data-Driven Insights Enhance Strategy',
          description:
            "<strong>Relying on intuition?</strong> Say goodbye! Companies using data analytics see a 5-6% increase in productivity. <ul><li>Understand user behavior better.</li><li>Identify market trends effectively.</li><li>Tailor products to customer needs.</li></ul> It's not just numbers—it's insight!",
        },
        isSldieVisible: true,
        showTitle: true,
        showSubTitle: true,
        showDescription: true,
        showImage: false,
        showProfileShot: true,
        contentImage: '',
      },
      {
        type: 'body_slide',
        content: {
          heading: 'Predictive Analytics: The Future is Now',
          description:
            'Imagine knowing what sales will look like next quarter <strong>before</strong> it happens! Predictive analytics empower firms with insights fueled by historical data. Every data point is a piece of your future puzzle. Companies implementing machine learning reduce costs by up to <strong>20%</strong>!',
        },
        isSldieVisible: true,
        showTitle: true,
        showSubTitle: true,
        showDescription: true,
        showImage: false,
        showProfileShot: true,
        contentImage: '',
      },
      {
        type: 'body_slide',
        content: {
          heading: 'Overcoming Challenges with Data Tools',
          description:
            'Data science can introduce complexity, but the rewards are unmatched! <strong>Key strategies to simplify:</strong> <ol><li>Invest in user-friendly platforms.</li><li>Train staff to interpret results.</li><li>Start with small projects to build trust.</li></ol> It isn’t just about the data—it’s how you wield it!',
        },
        isSldieVisible: true,
        showTitle: true,
        showSubTitle: true,
        showDescription: true,
        showImage: false,
        showProfileShot: true,
        contentImage: '',
      },
      {
        type: 'ending_slide',
        content: {
          heading: 'Stay Ahead of the Data Curve!',
          description:
            'Want more insights into leveraging data science successfully? Join our community for expert advice, success stories, and the latest trends in the field!',
          cta_button: 'Follow for More Insights',
        },
        isSldieVisible: true,
        showTitle: true,
        showSubTitle: true,
        showDescription: true,
        showImage: false,
        showProfileShot: false,
        contentImage: '',
      },
    ];
    let carouselIdea = this.choiceCarouselForm.get('carouselIdea')?.value;
    let carouselLength = this.choiceCarouselForm.get('carouselLength')?.value;

    this._designControlService.setCarouselIdeaContent({
      choiceTemplatesId: this.choiceTemplatesId,
      themeType: this.choiceCarouselForm.get('themeType')?.value,
      content: this.genratedIdeaData,
      carouselName:
        carouselIdea?.length > 12
          ? carouselIdea?.substring(0, 12)
          : carouselIdea,
      carouselIdea: carouselIdea,
      carouselLength: carouselLength,
      genratedType: this.genratedType,
      isGenratedFirst: true,
      isEditable: false,
    });

    this.dialogRef.close();
    this.router.navigate(['/visual-creative/carousel']);
  }

  cancelCreation() {
    this.submitted = false;
    this.choiceCarouselForm.reset();
  }

  selectSaveTemplates(selectTemplateId: any) {
    this.dialogRef.close();
    this.router.navigate(['/visual-creative/carousel/' + selectTemplateId]);
  }

  getCustomTemplate() {
    this._loader.start();

    this._carouselService.getAllCustomTemplate({ isTemplate: true }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.carouselSaveTemplateArray = response?.data;
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
