import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-creative-image-editor',
  templateUrl: './creative-image-editor.component.html',
  styleUrls: ['./creative-image-editor.component.scss']
})
export class CreativeImageEditorComponent {

  @Input() imageSrc: string | any;
  @Input() containerStyles: any = {}; // This will manage position & size
  resizing = false;
  dragging = false;
  selected = false;
  startX: number = 0;
  startY: number = 0;
  resizeDirection: string = '';


  constructor()
  { 
    console.log("imageSrc",this.imageSrc);
  }

  startResizing(event: MouseEvent, direction: string) {
    this.resizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  startDragging(event: MouseEvent) {
    this.dragging = true;
    this.startX = event.clientX - this.containerStyles.left;
    this.startY = event.clientY - this.containerStyles.top;
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(event: MouseEvent) {
    if (this.resizing) {
      let deltaX = event.clientX - this.startX;
      let deltaY = event.clientY - this.startY;

      switch (this.resizeDirection) {
        case 'top-left':
          this.containerStyles.width -= deltaX;
          this.containerStyles.height -= deltaY;
          break;
        case 'top-right':
          this.containerStyles.width += deltaX;
          this.containerStyles.height -= deltaY;
          break;
        case 'bottom-left':
          this.containerStyles.width -= deltaX;
          this.containerStyles.height += deltaY;
          break;
        case 'bottom-right':
          this.containerStyles.width += deltaX;
          this.containerStyles.height += deltaY;
          break;
      }

      // Set minimum size
      this.containerStyles.width  = Math.max(50, this.containerStyles.width);
      this.containerStyles.height = Math.max(50, this.containerStyles.height);

      this.startX = event.clientX;
      this.startY = event.clientY;
    }

    if (this.dragging) {
      this.containerStyles.left = event.clientX - this.startX;
      this.containerStyles.top = event.clientY - this.startY;
    }
  }

  @HostListener('window:mouseup')
  stopDragging() {
    this.resizing = false;
    this.dragging = false;
  }

  selectImage(event: MouseEvent) {
    event.stopPropagation();
    this.selected = true;
  }

  @HostListener('window:click')
  deselectImage() {
    this.selected = false;
  }
  
}
