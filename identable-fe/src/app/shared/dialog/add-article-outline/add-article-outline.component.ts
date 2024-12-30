import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-article-outline',
  templateUrl: './add-article-outline.component.html',
  styleUrls: ['./add-article-outline.component.scss'],
})
export class AddArticleOutlineComponent {
  addHedingType: any = 'Headline';
  isAddInputActive: boolean = true;
  isSubmit: boolean = false;
  heading: any;
  headingIndex: any;
  headingData: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddArticleOutlineComponent>
  ) {}

  submit() {
    this.dialogRef.close(this.headingData);
  }

  removeHeading(index: any, type: any, subIndex?: any) {
    if (type == 'heading') {
      this.headingData?.splice(index, 1);
    } else {
      this.headingData[index].h3?.splice(subIndex, 1);
    }
    if (this.headingData?.length == 0) {
      this.isAddInputActive = true;
    }
  }

  addHeadline(type: any, index?: any) {
    this.isAddInputActive = true;
    if (type == 'heading') {
      this.addHedingType = 'Headline';
    } else {
      this.addHedingType = 'Sub-Headline';
      this.headingIndex = index;
    }
  }

  add() {
    this.isSubmit = true;
    if (!this.heading) {
      return;
    }
    if (this.addHedingType == 'Headline') {
      this.headingData.push({ h2: this.heading });
    } else {
      if (!this.headingData[this.headingIndex]?.h3) {
        this.headingData[this.headingIndex].h3 = [];
      }
      this.headingData[this.headingIndex]?.h3.push(this.heading);
    }
    this.isSubmit = false;
    this.heading = '';
    this.isAddInputActive = false;
  }

  drop(event: any, index: number) {
    const draggedItem = event.item.data;
    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      if (draggedItem?.h2 !== undefined) {
        const h1Index = this.headingData.findIndex(
          (item: any) => item === draggedItem
        );

        this.headingData?.splice(
          event.currentIndex,
          0,
          this.headingData?.splice(h1Index, 1)[0]
        );
      } else {
        this.headingData[index]?.h3?.splice(
          event.currentIndex,
          0,
          this.headingData[index]?.h3?.splice(event.previousIndex, 1)[0]
        );
      }
    }
  }
}
