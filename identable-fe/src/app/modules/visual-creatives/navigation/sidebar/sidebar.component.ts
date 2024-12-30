import { Component, EventEmitter, Output } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// COMPONENTS
import { CarouselTemplatesComponent } from '../../dialog/carousel-templates/carousel-templates.component';
import { AdCreativeTemplatesComponent } from '../../dialog/ad-creative-templates/ad-creative-templates.component';

// SERVICES
import { CarouselTemplatesService } from '../../../../providers/visual-creatives/carousel/templates/carousel-templates.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { DesignControlService } from '../../../../providers/visual-creatives/carousel/design-control/design-control.service';
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { designControl } from '../../../../utils/carousel-control/design-control';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() controlSelected = new EventEmitter<string>();
  selectedControl: string = 'Layers';

  dialogRef: any;

  choiceTemplatesId: any;
  currentContent: any;
  carouselName: any;
  carouselIdea: any;
  carouselLength: any;
  themeType:any;

  isAdcreative: boolean = false;

  // Template Id Manage
  currentTemplateId:any;
  newTemplateId:any;
  constructor(
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private designControlService: DesignControlService,
    private _contentDesignService: ContentDesignService,
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    private carouselTemplatesService: CarouselTemplatesService,
    public _utilities: CommonFunctionsService,
    private router: Router,
    public _globalService: GlobalService,
    private formBuilder: FormBuilder
  )
  {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(val['urlAfterRedirects'].indexOf('/visual-creative/adcreative') >= 0){
          this.isAdcreative = true;
        }
      }
    });

    this.designControlService.aiIdeanContent$.subscribe((data) => {
      this.currentTemplateId = data?.choiceTemplatesId;
      this.choiceTemplatesId = data?.choiceTemplatesId;
      this.currentContent    = data?.content;
      this.themeType         = data?.themeType;
      this.carouselName      = data?.carouselName;      
    });
  }

  // Emits the selected menu to the parent component (app-carousel-editor)
  selectMenu(menu: string) {
    this.selectedControl = menu;
    this.controlSelected.emit(menu);
  }

  choiceTemplates(menu: string) {

    this.dialogRef = this._dialog.open(CarouselTemplatesComponent, {
      width: '1280px',
      disableClose: false,
      panelClass: 'custom-choice-carousel-modal',
      data: { isTemplates: true,choiceTemplatesId:this.choiceTemplatesId},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {

      console.log("result",result);

      if(result && result != undefined)
      {
        this.newTemplateId = result;
      }
      
      let getCurrentContent: any =
        this.carouselTemplatesService.getTemplateById(
          designControl?.defaultTemplate
        );
      
        console.log("this.newTemplateId",this.newTemplateId);


      this.currentContent =  this.currentContent?.length > 0  ? this.currentContent  : getCurrentContent?.slides;
      
      console.log("this.currentContent",this.currentContent);

      if (this.currentTemplateId != this.newTemplateId && this.newTemplateId) {

        this.designControlService.setCarouselIdeaContent({
          choiceTemplatesId: this.newTemplateId,
          themeType : this.themeType,
          content: this.currentContent,
          carouselName: this.carouselName,
          carouselIdea: this.carouselIdea,
          carouselLength: this.carouselLength,
          genratedType: 'templates',
          isGenratedFirst: true,
          isEditable: false,
        });

      } 

    });
  }

  choiceAdCreativeTemplates(menu: string) {
    this.dialogRef = this._dialog.open(AdCreativeTemplatesComponent, {
      width: '1280px',
      disableClose: false,
      panelClass: 'custom-choice-carousel-modal',
      data: { isTemplates: true },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      
      this._contentDesignService.genratedContent$.subscribe((data) => {
        this.choiceTemplatesId = data?.choiceTemplatesId;
        this.currentContent    = data?.content;
        this.themeType         = data?.themeType;
        this.carouselName      = data?.idea;
      });

      let getCurrentContent: any = this._adCreativeTemplatesService.getTemplateById(designControl?.defaultTemplate);

      this.choiceTemplatesId = result ? result : this.choiceTemplatesId;
      this.currentContent    =
        this.currentContent?.length > 0
          ? this.currentContent
          : getCurrentContent?.content;

      if (this.choiceTemplatesId) {
        this._contentDesignService.setAdCreativeContent({
          choiceTemplatesId: this.choiceTemplatesId,
          themeType: 'custom',
          content: this.currentContent,
          idea: this.carouselName,
          title: this.carouselName,
          genratedType: '',
          isGenratedFirst: true,
          isEditable: false,
        });
      } else if (!this.choiceTemplatesId) {
        this._contentDesignService.setAdCreativeContent({
          choiceTemplatesId: designControl?.defaultTemplate,
          themeType : this.themeType,
          content: this.currentContent,
          idea: this.carouselName,
          title: this.carouselName,
          genratedType: '',
          isGenratedFirst: true,
          isEditable: false,
        });
      } else {
        this._contentDesignService.setAdCreativeContent({
          choiceTemplatesId: this.choiceTemplatesId,
          themeType : this.themeType,
          content: getCurrentContent?.content,
          idea: this.carouselName,
          title: this.carouselName,
          genratedType: '',
          isGenratedFirst: true,
          isEditable: false,
        });
      }

    });
  }

}
