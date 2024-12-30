import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { GlobalService } from '../../../utils/common-functions/global.service';

// COMPONENTS
import { PlanUpgradeDialogComponent } from 'src/app/shared/dialog/plan-upgrade-dialog/plan-upgrade-dialog.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';
@Component({
  selector: 'app-ai-setting',
  templateUrl: './ai-setting.component.html',
  styleUrls: ['./ai-setting.component.scss'],
})
export class AiSettingComponent {
  @Output() onSubmitAiSetting = new EventEmitter();

  aiLanguage: any = [];
  pointOfView: any = [];
  aiTone: any = [];
  aiFormality: any = [];

  profileAndPageList: any = [];
  advanceSettingData: any = [];
  aiSettingForm: FormGroup;
  submitted: boolean = false;
  aiSettingUpdate: boolean = false;
  aiSettingID: string = '';
  aiToneRequied: boolean = false;
  dialogRef: any;

  assignData: any;
  selectPageAndProfile: any;
  userSubscription: any = [];
  selectedPageId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private _formBuilder: FormBuilder,
    public _userService: UserService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _dialog: MatDialog,
    public _globalService: GlobalService
  ) {
    this.aiLanguage = commonConstant.aiLanguage;
    this.pointOfView = commonConstant.pointOfView;
    this.aiTone = commonConstant.aiTone;
    this.aiFormality = commonConstant.aiFormality;

    this.aiSettingForm = this.formBuilder.group({
      advanceSetting: this._formBuilder.array([]),
      chatGPTVersion: ['4'],
    });
  }

  getAdvanceSettingControls(): AbstractControl[] {
    return (this.aiSettingForm.get('advanceSetting') as FormArray).controls;
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getLinkedinPageList({});

    let filterArray = this._utilities.linkedinPageList?.filter(
      (x: any) => x?.type == 'profile'
    );
    if (filterArray?.length > 0) {
      this.selectedPageId = filterArray[0]._id;
    }

    this.setFormData();
  }

  setFormData() {
    this._utilities.linkedinAccessPageList?.forEach((x: any) => {
      const group = this._formBuilder.group({
        formality: ['', Validators.required],
        tone: this._formBuilder.group({
          personable: [false],
          confident: [false],
          empathetic: [false],
          engaging: [false],
          witty: [false],
          direct: [false],
        }),
        language: ['', Validators.required],
        keyword: [[], Validators.required],
        about: [
          x?.type == 'profile'
            ? this._utilities.linkedinProfileData?.about || ''
            : '',
          Validators.required,
        ],
        pointOfView: ['', Validators.required],
        targetAudience: [[], Validators.required],
        objective: ['', Validators.required],
        callOfAction: [''],
        website: [''],
        sellType: [''],
        pageId: [x?._id],
        type: [x?.type],
      });

      (this.aiSettingForm.get('advanceSetting') as FormArray).push(group);
    });

    this.getAiSetting();
  }

  fillFormData() {}

  clineFormArray() {
    const controlArray = this.aiSettingForm.get('advanceSetting') as FormArray;
    while (controlArray.length) {
      controlArray.removeAt(0);
    }
  }

  selectTone(event: any, tone: any, index: any) {
    let isChecked = event.target.checked;
    let checkAdvanceSettingArry = this.aiSettingForm.get(
      'advanceSetting'
    ) as FormArray;
    const toneControl = checkAdvanceSettingArry.controls[index].get('tone');
    const currentValue = toneControl?.value || {};
    const selectedTones = Object.keys(currentValue).filter(
      (key) => currentValue[key]
    );

    if (isChecked && selectedTones.length >= 3) {
      this.toastr.error('Allow a maximum selection of 3 AI tones.');
      event.target.checked = false;
      return;
    }

    if (currentValue?.hasOwnProperty(tone)) {
      if (currentValue[tone] == true) {
        currentValue[tone] = false;
      } else {
        currentValue[tone] = true;
      }
      checkAdvanceSettingArry.controls[index]
        .get('tone')
        ?.setValue(currentValue);
    }
  }

  checkedTone(tone: any, index: any) {
    let checkAdvanceSettingArry = this.aiSettingForm.get(
      'advanceSetting'
    ) as FormArray;
    const toneControl = checkAdvanceSettingArry.controls[index].get('tone');
    const currentValue = toneControl?.value || [];
    if (currentValue?.hasOwnProperty(tone)) {
      if (currentValue[tone] == true) {
        return true;
      }
    }
    return false;
  }

  onSubmit(redirectDashboard: boolean) {
    this.submitted = true;

    this.checkAdvanceSettingValidation();
    if (this.aiSettingForm.invalid) {
      return;
    }

    let payload = this.aiSettingForm.getRawValue();

    for (let i = 0; i < payload?.advanceSetting?.length; i++) {
      let advObj = payload?.advanceSetting[i];
      let keywordsArray = advObj?.keyword?.map((obj: any) => obj?.value);
      advObj['keyword'] = keywordsArray;

      let targetAudienceArray = advObj?.targetAudience?.map(
        (obj: any) => obj?.value
      );
      advObj['targetAudience'] = targetAudienceArray;
    }

    let params = payload;

    this.loaderService.start();
    this._userService.saveAISetting(params).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this.toastr.success('AI Settings saved successfully', '');
          if (redirectDashboard) {
            setTimeout(() => {
              window.location.href = '/dashboard';
            });
          }
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getAiSetting() {
    this.loaderService.start();
    this._userService.getAISetting({}).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.aiSettingData = response.data?.settingData;
          if (this._utilities.aiSettingData?.length > 0) {
            this.aiSettingForm.patchValue({
              chatGPTVersion: this._utilities.aiSettingData[0].chatGPTVersion,
            });
          }

          if (this._utilities.aiSettingData) {
            const advanceSettingArray = this.aiSettingForm.get(
              'advanceSetting'
            ) as FormArray;

            if (advanceSettingArray) {
              const advanceSettingControls = advanceSettingArray.controls;

              advanceSettingControls.forEach((control: AbstractControl) => {
                if (control.value.pageId) {
                  const filterArray = this._utilities.aiSettingData?.filter(
                    (x: any) => x.pageId == control.value.pageId
                  );

                  if (filterArray?.length > 0) {
                    const advObj = filterArray[0];

                    let newKeyword = [];

                    for (let i = 0; i < advObj?.keyword.length; i++) {
                      const val = advObj?.keyword[i];
                      newKeyword.push({
                        display: val,
                        value: val,
                      });
                    }
                    let newTargetAudience = [];
                    for (let i = 0; i < advObj?.targetAudience.length; i++) {
                      const val = advObj?.targetAudience[i];
                      newTargetAudience.push({
                        display: val,
                        value: val,
                      });
                    }

                    control.patchValue({
                      formality: advObj?.formality,
                      tone: advObj?.tone,
                      language: advObj?.language,
                      keyword: newKeyword,
                      about: advObj?.about
                        ? advObj?.about
                        : this._utilities.linkedinProfileData?.about,
                      pointOfView: advObj?.pointOfView,
                      targetAudience: newTargetAudience,
                      objective: advObj?.objective,
                      callOfAction: advObj?.callOfAction,
                      website: advObj?.website,
                      sellType: advObj?.sellType,
                    });
                  }
                }
              });
            }
          }
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.aiSettingForm.controls[controlName].hasError(errorName);
  };

  OpenGenerateCommonPrompt(type: any, title: string, index: any) {
    let obj = {};

    const asData = (this.aiSettingForm.get('advanceSetting') as FormArray).at(
      index
    );
    let keyword = asData.get('keyword')?.value?.map((obj: any) => obj?.value);
    let youAre = asData.get('about')?.value;
    let pageId = asData.get('pageId')?.value;
    let pointOfView = asData.get('pointOfView')?.value;

    obj = { type, title, pageId: pageId, pointOfView: pointOfView };

    if (!youAre) {
      this.toastr.error('Please enter about', '');
      return;
    }
    if (keyword && youAre) {
      obj = {
        ...obj,
        keyword: keyword,
        youAre: youAre,
      };
    }
    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.setAdvanceSettingValue(type, result, index);
      }
    });
  }

  setAdvanceSettingValue(type: string, data: any, index: any) {
    const asData = (this.aiSettingForm.get('advanceSetting') as FormArray).at(
      index
    );
    if (type == 'keyword') {
      const currentTags = asData.get('keyword')?.value || [];
      let topics: { display: any; value: any }[] = [];
      data.forEach((value: any) => {
        if (value) {
          let topicObj = {
            display: value,
            value: value,
          };
          if (topics?.length < 3) {
            currentTags.push(topicObj);
          }
        }
      });
      asData.get('keyword')?.setValue(currentTags);
    }
    if (type == 'yourself') {
      asData.get('about')?.setValue(data);
    }
    if (type == 'targetAudience') {
      const currentTags = asData.get('targetAudience')?.value || [];
      let topics: { display: any; value: any }[] = [];
      data.forEach((value: any) => {
        if (value) {
          let topicObj = {
            display: value,
            value: value,
          };
          if (topics?.length < 3) {
            currentTags.push(topicObj);
          }
        }
      });
      asData.get('targetAudience')?.setValue(currentTags);
    }
    if (type == 'objective') {
      asData.get('objective')?.setValue(data);
    }
    if (type == 'callOfAction') {
      asData.get('callOfAction')?.setValue(data);
    }
  }

  selectProfileType(data: any) {
    if (data?.isAccess) {
      this.selectedPageId = data?._id;
    } else {
      this.planUpgardDialog();
    }
  }

  onChangeProfileType(event: Event, data: any) {
    if (data?.type == 'page') {
      event.preventDefault();
    }
  }

  planUpgardDialog() {
    this.dialogRef = this._dialog.open(PlanUpgradeDialogComponent, {
      width: '550px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        window.open('/subscription', '_blank');
      }
    });
  }

  checkAdvanceSettingValidation() {
    let checkAdvanceSettingArry = this.aiSettingForm.get(
      'advanceSetting'
    ) as FormArray;
    for (
      let index = 0;
      index < checkAdvanceSettingArry.controls.length;
      index++
    ) {
      let control = checkAdvanceSettingArry.controls[index];

      if (
        !control.get('formality')?.value ||
        !control.get('tone')?.value ||
        !control.get('language')?.value ||
        !control.get('keyword')?.value ||
        !control.get('about')?.value ||
        !control.get('pointOfView')?.value ||
        !control.get('targetAudience')?.value ||
        !control.get('callOfAction')?.value ||
        !control.get('objective')?.value
      ) {
        this.selectedPageId = control.get('pageId')?.value;
        break;
      }
    }
  }
}
