import { Component } from '@angular/core';

// LIBRARY
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { AdCreativeService } from 'src/app/providers/adCreative/ad-creative.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { designControl } from '../../../../utils/carousel-control/design-control';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-choice-ad-creative-templates',
  templateUrl: './choice-ad-creative-templates.component.html',
  styleUrls: ['./choice-ad-creative-templates.component.scss'],
})
export class ChoiceAdCreativeTemplatesComponent {
  creativeTemplates: any[] = [];

  // Manage Content
  currentContent: any;
  choiceTemplatesId: any = 'template1';
  carouselName: any;
  themeType: any;

  // Template Id Manage
  currentTemplateId: any;
  newTemplateId: any;

  idea: any;
  genratedType: any;
  constructor(
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    public _generalService: GeneralService,
    public _adCreative: AdCreativeService,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _contentDesignService: ContentDesignService,
    public _utilities: CommonFunctionsService
  ) {
    this._contentDesignService.genratedContent$.subscribe((data) => {
      console.log('Ad creative data', data);
      this.currentTemplateId = data?.choiceTemplatesId;
      this.choiceTemplatesId = data?.choiceTemplatesId;
      this.currentContent = data?.content;
      this.themeType = data?.themeType;
      this.idea = data?.idea;
      this.genratedType = data?.genratedType;
    });
  }

  ngOnInit(): void {
    this.fetchAdCreativeTemplates();
  }

  choiceNewTemplate(data: any) {
    if (data && data?.templateId != undefined) {
      this.newTemplateId = data?.templateId;
    }

    console.log('this.newTemplateId', this.newTemplateId);

    let getCurrentContent: any =
      this._adCreativeTemplatesService.getTemplateById(
        designControl?.defaultTemplate
      );

    this.currentContent = this.currentContent
      ? this.currentContent
      : getCurrentContent?.content;

    console.log('this.currentContent ->>', this.currentContent);

    if (this.currentTemplateId != this.newTemplateId && this.newTemplateId) {
      this._contentDesignService.setAdCreativeContent({
        choiceTemplatesId: this.newTemplateId,
        themeType: this.themeType,
        content: this.currentContent,
        title: this.idea?.length > 12 ? this.idea?.substring(0, 12) : this.idea,
        idea: this.idea,
        genratedType: 'template',
        isGenratedFirst: true,
        isEditable: false,
      });
    }
  }

  //creative templates by type

  getTemplatesByType(): void {
    const templates = this._adCreativeTemplatesService.getAllTemplate();
    const grouped = templates.reduce((acc: any, template: any) => {
      if (!acc[template.type]) {
        acc[template.type] = [];
      }
      acc[template.type].push(template);
      return acc;
    }, {});

    this.creativeTemplates = Object.keys(grouped).map((type) => ({
      type,
      templates: grouped[type],
    }));
  }

  // Fetch templates

  fetchAdCreativeTemplates() {
    let obj = {};
    this._loader.start();
    this._adCreative.getAdCreativeTemplates(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let templates = response?.data;
          this._utilities.adCreativeTemplateArray = response?.data;
          const grouped = templates.reduce((acc: any, template: any) => {
            if (!acc[template.type]) {
              acc[template.type] = [];
            }
            acc[template.type].push(template);
            return acc;
          }, {});

          this.creativeTemplates = Object.keys(grouped).map((type) => ({
            type,
            templates: grouped[type],
          }));
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
}
