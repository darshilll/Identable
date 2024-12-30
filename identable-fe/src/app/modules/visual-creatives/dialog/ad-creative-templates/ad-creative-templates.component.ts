import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { AdCreativeTemplatesService } from '../../../../providers/visual-creatives/ad-creative/templates/ad-creative-templates.service';
import { ContentDesignService } from '../../../../providers/visual-creatives/ad-creative/content-design/content-design.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { AdCreativeService } from 'src/app/providers/adCreative/ad-creative.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-ad-creative-templates',
  templateUrl: './ad-creative-templates.component.html',
  styleUrls: ['./ad-creative-templates.component.scss'],
})
export class AdCreativeTemplatesComponent {
  creativeTemplates: any[] = [];
  choiceTemplatesId: any = 'template1';

  choiceCreativeForm: FormGroup;
  submitted: boolean = false;
  keyImagetype: any;
  isGeneratedImageType: any = 'ai-image';

  creditDeducated: number = 0;
  creditMessage: any;

  customImageUrl: any;

  isTemplates: boolean = false;
  genratedType: any = 'presets';
  selectedPresetsType: any = 'Square Ad';
  selectAdtype: any = 'Square Ad (Instagram/Facebook)';

  presetsListArray: any = [
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'Square Ad',
      adType: 'Square Ad (Instagram/Facebook)',
      size: '1080 x1080 px',
      isComing: false,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'Instagram Story Ad',
      adType: 'Instagram/Facebook Story Ad',
      size: '1080 x1920 px',
      isComing: false,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'Facebook Story Ad',
      adType: 'Instagram/Facebook Story Ad',
      size: '1080 x1920 px',
      isComing: false,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'Instagram post',
      adType: 'Instagram Post',
      size: '1080 x1350 px',
      isComing: false,
    },
    {
      image: 'assets/images/carousels-v2/type-of-content.png',
      type: 'LinkedIn Sponsored Content',
      adType: 'Instagram Post',
      size: '1200 x 627 px',
      isComing: true,
    },
  ];

  // Tamplates Tabs
  activeTab: any = 'presets';

  customeSaveTemplate: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private dialogRef: MatDialogRef<AdCreativeTemplatesComponent>,
    private formBuilder: FormBuilder,
    private _adCreativeTemplatesService: AdCreativeTemplatesService,
    public _generalService: GeneralService,
    public _adCreative: AdCreativeService,
    private _contentDesignService: ContentDesignService,
    private router: Router,
    public _utilities: CommonFunctionsService
  ) {
    this.isTemplates = data?.isTemplates;
    this.choiceCreativeForm = this.formBuilder.group({
      themeType: ['custom', Validators.required],
      contentImagetype: ['', Validators.required],
      creativeIdea: ['', Validators.required],
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.choiceCreativeForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    this.fetchAdCreativeTemplates();
    this.creditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  // Change the tabs

  changeTempTabs(tabs: any) {
    this.genratedType = tabs;
    this.choiceTemplatesId = '';
    this.activeTab = tabs;
    if (tabs == 'savetemplate') {
      this.getCustomeSaveTemplate();
    }
  }

  onChangeKeyImage(event: any) {
    this.keyImagetype = event.target.value;
  }

  uploadImage(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this._loader.start();
      const formData = new FormData();
      formData.append('file', file, file.name);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.customImageUrl = response?.data[0]?.url;
            this._loader.stop();
          } else {
            this._loader.stop();
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

  removecustomImage() {
    this.customImageUrl = '';
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

  genratePresetsTemplate() {
    this.submitted = true;
    if (this.choiceCreativeForm.invalid) {
      return;
    } 
    let obj = { adType: this.selectAdtype };
    this._loader.start();
    this._adCreative.getPresetAdCreativeTemplate(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.presetadCreativeTemplateObject = response?.data;
          this.choiceTemplatesId = response?.data?.templateId;
          this.createAdCreative();
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

  getCustomeSaveTemplate() {
    this._loader.start();
    this._adCreative.getAllTemplate({ isTemplate: true }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let templates = response?.data;

          this._utilities.adCreativeSaveTemplateArray = response?.data;

          const grouped = templates.reduce((acc: any, template: any) => {
            if (!acc[template?.templateSetting?.type]) {
              acc[template?.templateSetting?.type] = [];
            }

            // Push both templateSetting and mediaUrl
            acc[template?.templateSetting?.type].push({
              ...template?.templateSetting,
              mediaUrl: template?.mediaUrl // Adding mediaUrl
            });

            return acc;
          }, {});

          this.customeSaveTemplate = Object.keys(grouped).map((type) => ({
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

  // To Choice Templates

  selectTemplates(data: any, type: any) {
    if (type === 'savetemplate') {
      this.choiceTemplatesId = data?._id;
    } else {
      this.choiceTemplatesId = data?.templateId;
    }
    this.genratedType = type;
    this.selectedPresetsType = data?.type;
    this.selectAdtype = data?.adType;
  }

  applyTemplates(data: any) {
    this.dialogRef.close(data?.templateId);
  }

  cancelCreation() {
    this.submitted = false;
    this.choiceCreativeForm.reset();
    this.dialogRef.close();
  }

  generateAdCreative() {
    this.submitted = true;
    if (this.choiceCreativeForm.invalid) {
      return;
    }
    if (
      (this.genratedType === 'template' ||
        this.genratedType == 'savetemplate') &&
      !this.choiceTemplatesId
    ) {
      this._toastr.error('Please choice template');
      return;
    }
    let topic = this.choiceCreativeForm.get('creativeIdea')?.value;
    let obj = {};

    obj = {
      topic: topic,
    };

    if (this.keyImagetype === 'Generated image') {
      obj = {
        ...obj,
        generatedImageType: this.isGeneratedImageType,
      };
    }
    this._loader.start();
    this._adCreative.generateCreative(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          let genratedIdeaData = response?.data;

          if (this.keyImagetype === 'Custom image') {
            genratedIdeaData.contentImage = this.customImageUrl;
          }
          genratedIdeaData.imageGeneratedType = this.keyImagetype;
      
          genratedIdeaData.showSubTitle = true;
          genratedIdeaData.showTitle = true;
          genratedIdeaData.showDescription = true;
          genratedIdeaData.showImage = true;
          genratedIdeaData.showCTA = true;

          let idea = this.choiceCreativeForm.get('creativeIdea')?.value;

          this._contentDesignService.setAdCreativeContent({
            choiceTemplatesId: this.choiceTemplatesId,
            themeType: this.choiceCreativeForm.get('themeType')?.value,
            content: genratedIdeaData,
            title: idea?.length > 12 ? idea?.substring(0, 12) : idea,
            idea: idea,
            genratedType: this.genratedType,
            isGenratedFirst: true,
            isEditable: false,
          });
          this.dialogRef.close();
          this.router.navigate(['/visual-creative/adcreative']);
          this._loader.stop();
        } else {
          this._loader.stop();
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

  createAdCreative() {
    this.submitted = true;
    if (this.choiceCreativeForm.invalid) {
     return;
    }
    if (
      (this.genratedType === 'template' ||
        this.genratedType == 'savetemplate') &&
      !this.choiceTemplatesId
    ) {
      this._toastr.error('Please choice template');
      return;
    }
    let genratedIdeaData = {
      subtitle: 'Your amazing subtitle goes here Test',
      title: 'Amazing Catchy Title Goes Right Here! Test',
      description: 'Your amazing description goes here. Tests',
      imageGeneratedType: this.keyImagetype,
      contentImage: 'https://images.pexels.com/photos/10503934/pexels-photo-10503934.jpeg?auto=compress&cs=tinysrgb&h=350',
      showSubTitle: false,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
    };
    let idea = this.choiceCreativeForm.get('creativeIdea')?.value;
    this._contentDesignService.setAdCreativeContent({
      choiceTemplatesId: this.choiceTemplatesId,
      themeType: this.choiceCreativeForm.get('themeType')?.value,
      content: genratedIdeaData,
      title: idea?.length > 12 ? idea?.substring(0, 12) : idea,
      idea: idea,
      genratedType: this.genratedType,
      isGenratedFirst: true,
      isEditable: false,
    });
    this.dialogRef.close();
    this.router.navigate(['/visual-creative/adcreative']);
  }
  
}
