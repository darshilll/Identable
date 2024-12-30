import { Component, Output, EventEmitter,Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// SERVICES
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';

@Component({
  selector: 'app-layers-control',
  templateUrl: './layers-control.component.html',
  styleUrls: ['./layers-control.component.scss'],
})
export class LayersControlComponent {
  @Output() toggleImage = new EventEmitter<{ slide: any; index: number }>();
  @Output() toggleSubTitle = new EventEmitter<{ slide: any; index: number }>();
  @Output() toggleTitle = new EventEmitter<{ slide: any; index: number }>();
  @Output() toggleDescription = new EventEmitter<{
    slide: any;
    index: number;
  }>();
  @Output() toggleProfileShots = new EventEmitter<{
    slide: any;
    index: number;
  }>();
  @Output() toggleCTA = new EventEmitter<{
    slide: any;
    index: number;
  }>();

  // Check input method
  @Input() isAdcreative: boolean = false;

  currentTemplate: any;

 
  constructor(
    private carouselTemplatesService: CarouselTemplatesService,
    private _designControlService: DesignControlService,
    private _contentDesignService: ContentDesignService,
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    private router: Router
  ){   
    
  }

  ngOnInit() {
    if (this.isAdcreative) {
      this._contentDesignService.genratedContent$.subscribe((data) => {
        console.log("data",data);
        if (data?.choiceTemplatesId) {
          this.currentTemplate = data?.content;
        } else {
          this.currentTemplate =
            this._adCreativeTemplatesService.getTemplateById(
              designControl?.defaultTemplate
            );
        }
      });
    } else {
      this._designControlService.aiIdeanContent$.subscribe((data) => {
        console.log("data",data);
        if (data?.choiceTemplatesId) {
          this.currentTemplate = data?.content;
        } else {
          this.currentTemplate = this.carouselTemplatesService.getTemplateById(
            designControl?.defaultTemplate
          );
          this.currentTemplate = this.currentTemplate?.slides;
        }
      });
    }
  }

  formatSlideType(slideType: string): string {
    if (!slideType) return slideType;
    
    // Replace underscores with spaces and capitalize first letters
    const formattedType = slideType
      .replace(/_/g, ' ') // Replace underscores with spaces
      .toLowerCase() // Convert the whole string to lowercase
      .replace(/\b\w/g, first => first.toUpperCase()); // Capitalize first letter of each word
    
    return formattedType;
  }
  
  // Method to trigger toggle in the parent component

  toggleImageVisibility(slide: any, index: number): void {
    slide.showImage = !slide.showImage;
    this.toggleImage.emit({ slide, index }); // Emit the event with slide and index to parent component
  }

  toggleSubTitleVisibility(slide: any, index: number): void {
    slide.showSubTitle = !slide.showSubTitle;
    this.toggleSubTitle.emit({ slide, index }); // Emit the event with slide and index to parent component
  }

  toggleTitleVisibility(slide: any, index: number): void {
    slide.showTitle = !slide.showTitle;
    this.toggleTitle.emit({ slide, index }); // Emit the event with slide and index to parent component
  }

  toggleDescriptionVisibility(slide: any, index: number): void {
    slide.showDescription = !slide.showDescription;
    this.toggleDescription.emit({ slide, index }); // Emit the event with slide and index to parent component
  }

  toggleProfileShotsVisibility(slide: any, index: number): void {
    slide.showProfileShot = !slide.showProfileShot;
    this.toggleProfileShots.emit({ slide, index }); // Emit the event with slide and index to parent component
  }

  toggleCTAVisibility(slide: any, index: number): void {
    slide.showCTA = !slide.showCTA;
    this.toggleCTA.emit({ slide, index }); // Emit the event with slide and index to parent component
  }
}
