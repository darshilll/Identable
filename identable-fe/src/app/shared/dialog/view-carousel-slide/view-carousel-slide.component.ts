import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-carousel-slide',
  templateUrl: './view-carousel-slide.component.html',
  styleUrls: ['./view-carousel-slide.component.scss'],
})
export class ViewCarouselSlideComponent {
  selectedImage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ViewCarouselSlideComponent>
  ) {
    this.selectedImage = this.data?.item?.slideImages[0];
  }

  onImage(img: string) {
    this.selectedImage = img;
  }

  onUseTemplate() {
    this.dialogRef.close(true);
  }
}
