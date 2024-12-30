import { Component, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';

// COMPONETS
import { DeleteConfirmationPopupComponent } from '../../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';

@Component({
  selector: 'app-slide-control',
  templateUrl: './slide-control.component.html',
  styleUrls: ['./slide-control.component.scss']
})
export class SlideControlComponent {
  currentTemplate: any;

  @Output() slideOrderChanged = new EventEmitter<any>();
  @Output() slideVisibility   = new EventEmitter<any>();

  dialogRef: any;
  constructor(
    private _dialog: MatDialog,
    private carouselTemplatesService: CarouselTemplatesService,
    private _designControlService: DesignControlService
  ){
    
  }

  ngOnInit() {
    this._designControlService.aiIdeanContent$.subscribe((data) => {
      if (data?.choiceTemplatesId) {
        this.currentTemplate = data?.content; 
      } else {
        this.currentTemplate = this.carouselTemplatesService.getTemplateById(designControl?.defaultTemplate);
        this.currentTemplate = this.currentTemplate?.slides;
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    // Update the order of slides when a drag-drop event happens
    moveItemInArray(this.currentTemplate, event.previousIndex, event.currentIndex);
    this.slideOrderChanged.emit(this.currentTemplate); // Emit the new order to parent component
  }

   // Function to toggle slide visibility
   toggleSlideVisibility(slide: any) {
    slide.isSldieVisible = !slide.isSldieVisible; // Toggle the visibility flag
    this.slideVisibility.emit(this.currentTemplate);
  }

  // Function to delete a slide
  deleteSlide(index: number) {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {message: 'Do you really want to delete these slide? This process cannot be undone.'},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.currentTemplate.splice(index, 1); // Remove slide by index
        this.slideOrderChanged.emit(this.currentTemplate);
      }
    });    
  }

}
