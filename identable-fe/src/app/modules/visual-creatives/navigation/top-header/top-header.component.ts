import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { DeleteCarouselConformationComponent } from '../../../../shared/common/delete-carousel-conformation/delete-carousel-conformation.component';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { PostService } from '../../../../providers/post/post.service';
import { CarouselService } from '../../../../providers/carousel/carousel.service';
import { AdCreativeService } from '../../../../providers/adCreative/ad-creative.service';

//COMPONENTS
import { CarouselDownloadPreviewComponent } from '../../dialog/carousel-download-preview/carousel-download-preview.component';
import { SwitchProfileComponent } from '../../../../shared/dialog/switch-profile/switch-profile.component';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';
import { commonConstant } from '../../../../utils/common-functions/common-constant';

import { ConfirmPostScheduledComponent } from '../../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss'],
})
export class TopHeaderComponent {
  @Output() downloadCarousel = new EventEmitter<void>();
  @Input() slideHtml: any;
  @Input() adCreativeHtml: any;
  @Input() slideSetting: any;
  @Input() carouselName: any;
  @Input() carouselIdea: any;
  @Input() carouselLength: any;
  @Input() templateSetting: any;
  @Input() carouselId: any;
  @Input() isAllowSchedule: boolean = true;
  @Input() isAdCreative: boolean = false;
  pdfUrl: any;
  mediaUrl: any;
  scheduleDialogOpen: boolean = false;
  isSchedulePost: boolean = false;
  isSaveAsTemp: boolean = false;
  rename: boolean = false;
  exportType: any;
  dialogRef: any;

  constructor(
    private _toastr: ToastrService,
    private _loader: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _postService: PostService,
    private _carousel: CarouselService,
    public _generalService: GeneralService,
    private _carouselService: CarouselService,
    private router: Router,
    private _dialog: MatDialog,
    private _adCreative: AdCreativeService
  ) {}

  logout() {
    this._utilities.logout();
  }

  // Change Profile dialog

  switchProfile() {
    this.dialogRef = this._dialog.open(SwitchProfileComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {});
  }

  scheduleDialogOpenClose(isOpen: boolean) {
    if (isOpen) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  async save(isTemplate?: boolean) {
    if (!this.carouselName || this.carouselName == 'N/A') {
      this._toastr.error('Please add template name.');
      return;
    }

    this.scheduleDialogOpen = false;
    this._loader.start();
    if (this.isAdCreative) {
      const templateHtml = this.adCreativeHtml;

      let imageBase64 = await this.htmlToCanvas([templateHtml]);
      this.mediaUrl = await this.uploadSingleImage(imageBase64[0]);

      this.isSaveAsTemp = isTemplate ? isTemplate : false;
      this.saveAdCreativeTemplate();
    } else {
      //For Carousel **************************************
      const slidesArray = this.slideHtml.toArray();
      let imageBase64 = await this.htmlToCanvas([slidesArray[0]]);
      this.mediaUrl = await this.uploadSingleImage(imageBase64[0]);
      this.isSaveAsTemp = isTemplate ? isTemplate : false;
      this.saveCustomTemplate();
    }
  }

  async scheduleCarousel(scheduleData: any) {
    let payload = {};
    this._loader.start();
    let documentDescription = 'Docuemnt';

    const slidesArray = this.slideHtml.toArray();

    if (this.slideSetting?.slides?.length) {
      documentDescription = this.slideSetting?.slides[0]?.content?.heading;
    }

    let imageBase64 = await this.htmlToCanvas(slidesArray);
    // this.mediaUrl = await this.uploadSingleImage(imageBase64[0]);
    let pdfBlob = await this.generatePdf(imageBase64);
    let pdfUrl = await this.uploadFile(pdfBlob);
    this.isSchedulePost = true;
    await this.save();
    let carouselTemplate = [];
    carouselTemplate.push(this.mediaUrl);
    payload = {
      postBody: this.carouselName,
      generatedType: commonConstant.POSTGENERATETYPE.CAROUSEL,
      status: commonConstant.POSTSTATUS.SCHEDULED,
      postMedia: pdfUrl,
      postMediaType: commonConstant.POSTMEDIATYPE.CAROUSEL,
      documentDescription: documentDescription,
      carouselSetting: this.slideSetting,
      carouselTemplate: carouselTemplate,
      carouselId: this.carouselId,
    };

    if (scheduleData?.savaDraft) {
      payload = { ...payload, status: commonConstant.POSTSTATUS.DRAFT };
    }

    if (
      scheduleData?.timestamp &&
      scheduleData?.timeSlot &&
      scheduleData?.timePeriod
    ) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
      };
    }

    this._postService.savePost(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let advancedScheduleCredit =
            this._utilities?.userData?.plan?.advancedScheduleCredit;
          this._utilities.manageCredit(false, advancedScheduleCredit);
          this.isSchedulePost = false;
          this.openConfirmPostScheduled();
          this.pdfUrl = '';
          this._toastr.success(response?.message);
        } else {
          // this.scheduleDialogOpen = false;
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

  uploadFile(pdfBlob: Blob) {
    return new Promise(async (resolve, reject) => {
      this._loader.start();
      const formData = new FormData();
      formData.append('file', pdfBlob, 'document.pdf');

      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            resolve(response?.data[0]?.url);
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
          this._loader.stop();
          resolve(true);
        },
        (err: ErrorModel) => {
          this._loader.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
          resolve(false);
        }
      );
    });
  }

  downloadPreview() {
    const slidesArray = this.slideHtml?.toArray();
    const adCreativeHtml = this.adCreativeHtml;
    let width = this.isAdCreative ? '800px' : '1140px';
    this.dialogRef = this._dialog.open(CarouselDownloadPreviewComponent, {
      width: width,
      disableClose: true,
      data: {
        topic: this.carouselName,
        slidesArray: slidesArray,
        adCreativeHtml: adCreativeHtml,
        isAdCreative: this.isAdCreative,
      },
    });
  }

  async saveCustomTemplate() {
    let payload = {};

    const slidesArray = this.slideHtml.toArray();
    if (!this.mediaUrl) {
      let imageBase64 = await this.htmlToCanvas([slidesArray[0]]);
      this.mediaUrl = await this.uploadSingleImage(imageBase64[0]);
    }
    payload = {
      carouselSetting: this.slideSetting,
      mediaUrl: this.mediaUrl,
      carouselName: this.carouselName ? this.carouselName : '',
      carouselIdea: this.carouselIdea ? this.carouselIdea : '',
      carouselLength: this?.carouselLength
        ? this?.carouselLength
        : slidesArray?.length,
      status: commonConstant?.POSTSTATUS.DRAFT,
    };

    if (this.isSaveAsTemp) {
      payload = {
        ...payload,
        isTemplate: true,
      };
    }

    if (this.isSchedulePost) {
      payload = {
        ...payload,
        status: commonConstant.POSTSTATUS.SCHEDULED,
      };
    }

    this._loader.start();

    if (this.carouselId) {
      //update
      payload = {
        ...payload,
        templateId: this.carouselId,
      };
      this._carousel.updateCustomTemplate(payload).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.carouselId = response?.data?._id;
            if (!this.isSchedulePost) {
              if (!this.isSaveAsTemp) {
                this.router.navigate([
                  `/visual-creative/carousel/${this.carouselId}`,
                ]);
              } else {
                this.isSaveAsTemp = false;
                this.router.navigate([`/visual-creative`]);
              }
              this._toastr.success('Template update successfully!');
            }
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
    } else {
      //save

      this._carousel.saveCustomTemplate(payload).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.carouselId = response?.data?._id;
            if (!this.isSchedulePost) {
              if (!this.isSaveAsTemp) {
                this.router.navigate([
                  `/visual-creative/carousel/${this.carouselId}`,
                ]);
              } else {
                this.isSaveAsTemp = false;
                this.router.navigate([`/visual-creative`]);
              }
              this._toastr.success('Template save successfully!');
            }
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

  saveAdCreativeTemplate() {
    let payload = {};
    payload = {
      templateSetting: this.templateSetting,
      mediaUrl: this.mediaUrl,
      title: this.carouselName ? this.carouselName : '',
      idea: this.carouselIdea ? this.carouselIdea : '',
    };

    if (this.isSaveAsTemp) {
      payload = {
        ...payload,
        isTemplate: true,
      };
    }

    this._loader.start();

    if (this.carouselId) {
      //update
      payload = {
        ...payload,
        templateId: this.carouselId,
      };
      this._adCreative.updateTemplate(payload).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.carouselId = response?.data?._id;
            if (!this.isSchedulePost) {
              if (!this.isSaveAsTemp) {
                this.router.navigate([
                  `/visual-creative/adcreative/${this.carouselId}`,
                ]);
              } else {
                this.isSaveAsTemp = false;
                this.router.navigate([`/visual-creative`]);
              }
              this._toastr.success('Template update successfully!');
            }
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
    } else {
      //save

      this._adCreative.saveTemplate(payload).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();

          if (response.statusCode == 200) {
            this.carouselId = response?.data?._id;
            if (!this.isSchedulePost) {
              if (!this.isSaveAsTemp) {
                this.router.navigate([
                  `/visual-creative/adcreative/${this.carouselId}`,
                ]);
              } else {
                this.isSaveAsTemp = false;
                this.router.navigate([`/visual-creative`]);
              }
              this._toastr.success('Template save successfully!');
            }
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

  async uploadSingleImage(image: any) {
    return new Promise(async (resolve, reject) => {
      const imageBlob = this.base64ToFile(image, 'image/jpeg');
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.jpg');
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            if (response?.data[0]?.url) {
              resolve(response?.data[0]?.url);
            }
          }
          resolve(true);
        },
        (err: ErrorModel) => {
          this._loader.stop();
          if (err.error) {
            const error: ResponseModel = err.error;
            this._toastr.error(error.message, '');
          } else {
            this._toastr.error(MessageConstant.unknownError, '');
          }
          resolve(false);
        }
      );
    });
  }

  base64ToFile(base64Data: string, contentType: string): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  carouselRename() {
    this.rename = true;
  }

  updateTitle() {
    if (!this.carouselName) {
      this._toastr.error('Enter carousel name');
      return;
    }

    if (!this.carouselId) {
      this.rename = false;
      return;
    }

    if (this.isAdCreative) {
      this.updateAdCreativeTitle();
    } else {
      this.updateCarouselTitle();
    }
  }

  updateCarouselTitle() {
    let obj = {
      carouselName: this.carouselName,
      templateId: this.carouselId,
    };
    this._loader.start();

    this._carouselService.updateCarouselName(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.carouselName = this.carouselName;
          this.rename = false;
          this._toastr.success(response?.data);
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

  updateAdCreativeTitle() {
    let obj = {
      title: this.carouselName,
      templateId: this.carouselId,
    };
    this._loader.start();

    this._adCreative.updateTitle(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.carouselName = this.carouselName;
          this.rename = false;
          this._toastr.success(response?.data);
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

  deleteCarousel() {
    let obj = {
      templateId: this.carouselId,
    };
    this._loader.start();

    this._carouselService.deleteCustomTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._toastr.success(response?.data);
          this.router.navigate(['/visual-creative']);
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

  deleteAdCreative() {
    this._loader.start();

    this._adCreative.deleteTemplate({ templateId: this.carouselId }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._toastr.success(response?.data);
          this.router.navigate(['/visual-creative']);
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

  confermationDialog(isAction: any) {
    this.dialogRef = this._dialog.open(DeleteCarouselConformationComponent, {
      width: '440px',
      data: { isAction: isAction },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result?.isAction == 'yes' && isAction == 'delete') {
          if (this.isAdCreative) {
            this.deleteAdCreative();
          } else {
            this.deleteCarousel();
          }
        }
        if (isAction == 'save') {
          if (result?.isAction == 'yes') {
            if (this.isAdCreative) {
              this.saveAdCreativeTemplate();
            } else {
              this.saveCustomTemplate();
            }
          } else {
            this.router.navigate(['/visual-creative']);
          }
        }
      }
    });
  }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      disableClose: true,
      data: {},
    });
  }

  async htmlToCanvas(slideHtml: any) {
    let imagArray = [];
    slideHtml?.forEach((slide: ElementRef) => {
      const element = slide.nativeElement.querySelector('.image-select-lable');
      if (element) {
        element.remove();
      }
    });

    for (let i = -1; i < slideHtml.length; i++) {
      let index = i;
      if (i == -1) {
        index = 0;
      }

      const slide = slideHtml[index];
      if (slide) {
        const imgData = await html2canvas(slide.nativeElement, {
          useCORS: true,
          scale: 2,
        }).then((canvas) => canvas.toDataURL('image/png'));
        if (i != -1) {
          imagArray.push(imgData);
        }
      }
    }

    return imagArray;
  }

  async generatePdf(imagArray: any) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 120],
    });
    pdf.setFillColor(255, 255, 255, 0);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      'F'
    );

    for (let i = -1; i < imagArray?.length; i++) {
      let index = i;
      if (i == -1) {
        index = 0;
      }

      const imgData = imagArray[index];

      pdf.addImage(imgData, 'PNG', 0, 0, 100, 120);

      if (index !== imagArray?.length - 1) {
        pdf.addPage();
      }
    }

    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  }
}
