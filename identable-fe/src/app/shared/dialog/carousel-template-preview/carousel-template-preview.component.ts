import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-carousel-template-preview',
  templateUrl: './carousel-template-preview.component.html',
  styleUrls: ['./carousel-template-preview.component.scss'],
})
export class CarouselTemplatePreviewComponent {
  selectedImage: string = '';
  slideList: any;

  // Slider Config
  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CarouselTemplatePreviewComponent>
  ) {
    this.slideList = data?.item?.previewImage;
    this.selectedImage = this.data?.item?.previewImage[0];
  }

  onImage(img: string) {
    this.selectedImage = img;
  }

  onUseTemplate() {
    this.dialogRef.close(this.data?.item?.templateId);
  }
}
