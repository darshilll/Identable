import {
  Component,
  Inject,
  OnInit,
  SimpleChanges,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import jsPDF from 'jspdf';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
@Component({
  selector: 'app-carousel-download-preview',
  templateUrl: './carousel-download-preview.component.html',
  styleUrls: ['./carousel-download-preview.component.scss'],
})
export class CarouselDownloadPreviewComponent implements AfterViewInit {
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  slideList: any[] = [];
  isSlideGenereated: boolean = false;
  isAllowExport: boolean = false;
  adCreativeImage: any;
  downloadSubject: Subject<any> = new Subject();
  // Slide Config
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: false,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CarouselDownloadPreviewComponent>,
    private _loader: LoaderService,
    private cdr: ChangeDetectorRef
  )
  {
    console.log("data",data);
  }

  async generateAdCreative() {
    const slide = this.data?.adCreativeHtml;

    const imgData = await html2canvas(slide.nativeElement, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => canvas.toDataURL(`image/png`));

    this.adCreativeImage = imgData;
    this.isAllowExport = true;
  }

  ngAfterViewInit() {
    if (this.data?.slidesArray) {
      this.slideList = new Array(this.data.slidesArray.length).fill('');
      this.generateImgae();
      this.initializeSlick();
    }
    if (this.data?.adCreativeHtml) {
      this.generateAdCreative();
    }
  }
  async generateImgae() {
    let slidesArray = this.data?.slidesArray;
    slidesArray?.forEach((slide: ElementRef) => {
      const element = slide.nativeElement.querySelector('.image-select-lable');

      if (element) {
        element.remove();
      }
    });

    let imagArray = [];
    for (let i = -1; i < slidesArray.length; i++) {
      let index = i;
      if (i == -1) {
        index = 0;
      }
      const slide = slidesArray[index];
      if (slide) {
        const imgData = await html2canvas(slide.nativeElement, {
          useCORS: true,
          scale: 2,
        }).then((canvas) => canvas.toDataURL(`image/png`));

        if (i != -1) {
          imagArray.push(imgData);
        }
      }
    }
    this.slideList = imagArray;
    this.refreshSlide();
    this.isAllowExport = true;
    this.isSlideGenereated = true;
  }

  download(type: any) {
    this._loader.start();
    if (type == 'png' || type == 'jpeg') {
      if (this.data?.isAdCreative) {
        const blob = this.dataURLToBlob(this.adCreativeImage);
        saveAs(blob, `ad-creative.${type}`);
        this._loader.stop();
        return;
      }
      let imagArray = [];
      const zip = new JSZip();
      for (let i = 0; i < this.slideList.length; i++) {
        let imgData = this.slideList[i];
        if (i != -1) {  
          const imageName  = this.data?.topic+`_${i + 1}.${type}`;
          const base64Data = imgData.split(',')[1]; // Extract base64 data
          zip.file(imageName, base64Data, { base64: true });

          imagArray.push(imgData);
        }
      }
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, `slides_${new Date().getTime()}.zip`);
      });
      this._loader.stop();
    } else {
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
      if (this.data?.isAdCreative) {
        pdf.addImage(this.adCreativeImage, 'PNG', 0, 0, 100, 120);
        pdf.save(this.data?.topic+'.pdf');
        this._loader.stop();
        return;
      }
      for (let i = 0; i < this.slideList.length; i++) {
        let index = i;

        let imgData = this.slideList[i];

        pdf.addImage(imgData, 'PNG', 0, 0, 100, 120);

        if (index !== this.slideList.length - 1) {
          pdf.addPage();
        }
      }
      this._loader.stop();
      pdf.save(this.data?.topic+'.pdf');
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slideList, event.previousIndex, event.currentIndex);
    this.refreshSlide();
  }

  refreshSlide() {
    if (this.slickModal) {
      this.slickModal?.unslick();

      this.cdr.detectChanges();
      setTimeout(() => {
        this.slickModal?.initSlick();
      }, 100);
    }
  }

  initializeSlick() {
    setTimeout(() => {
      if (this.slickModal) {
        this.slickModal?.initSlick();
      }
    }, 100);
  }

  dataURLToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0]?.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
