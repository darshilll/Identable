import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-style',
  templateUrl: './image-style.component.html',
  styleUrls: ['./image-style.component.scss'],
})
export class ImageStyleComponent {
  imageTypeForm: FormGroup;
  isSubmtted: boolean = false;

  imageOptions = [
    {
      value: 'images',
      label: 'Stock Images',
      imageSrc: 'assets/images/image-style/image-1.png',
    },
    {
      value: 'videos',
      label: 'Stock Videos',
      imageSrc: 'assets/images/image-style/image-2.png',
    },
    {
      value: '3d_illustrations',
      label: '3D illustrations',
      imageSrc: 'assets/images/image-style/image-3.png',
    },
    {
      value: 'cheerful_illustrations',
      label: 'Cheerful illustrations',
      imageSrc: 'assets/images/image-style/image-4.png',
    },
    {
      value: 'modern_illustrations',
      label: 'Modern illustrations',
      imageSrc: 'assets/images/image-style/image-5.png',
    },
    {
      value: 'hand_drawn_illustrations',
      label: 'Hand-drawn illustrations',
      imageSrc: 'assets/images/image-style/image-6.png',
    },
    {
      value: 'clean_illustrations',
      label: 'Clean illustrations',
      imageSrc: 'assets/images/image-style/image-7.png',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageStyleComponent>
  ) {
    this.imageTypeForm = this.formBuilder.group({
      imageType: ['', [Validators.required]],
    });
  }

  close() {
    this.dialogRef.close('');
  }

  submit() {
    this.isSubmtted = true;
    if (this.imageTypeForm.invalid) {
      return;
    }
    let value = this.imageTypeForm.get('imageType')?.value;

    this.dialogRef.close({ imageType: value });
  }
}
