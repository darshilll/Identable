import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

// COMPONENTS
import { PlanUpgradeDialogComponent } from 'src/app/shared/dialog/plan-upgrade-dialog/plan-upgrade-dialog.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

@Component({
  selector: 'app-ai-setting',
  templateUrl: './ai-setting.component.html',
  styleUrls: ['./ai-setting.component.scss'],
})
export class AiSettingComponent {
  aiLanguage: any = [];
  pointOfView: any = [];
  aiTone: any = [];
  aiFormality: any = [];

  profileAndPageList: any = [];
  advanceSettingData: any = [];
  aiSettingForm: FormGroup;
  submitted: boolean = false;
  aiSettingUpdate: boolean = false;
  submitBtnLable: string = 'Submit';
  aiSettingID: string = '';
  aiToneRequied: boolean = false;
  dialogRefPlan: any;

  assignData: any;
  selectPageAndProfile: any;
  aiSettingData: any;
  userSubscription: any = [];
  selectedPageId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AiSettingComponent>,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _formBuilder: FormBuilder,
    public _userService: UserService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService
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
    if (this._utilities.linkedinPageList?.length > 0) {
      let filterArray = this._utilities.linkedinPageList?.filter(
        (x: any) => x?.type == 'profile'
      );

      if (filterArray?.length > 0) {
        this.selectedPageId = filterArray[0]._id;
      }

      this.setFormData();
    } else {
      this.getLinkedinPageList();
    }
  }

  getLinkedinPageList() {
    this.loaderService.start();
    this._userService.getLinkedinPageList({}).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.linkedinProfileData =
            response.data?.linkedinProfileData;
          this._utilities.linkedinPageList = response.data?.linkedinPageData;

          this._utilities.linkedinAccessPageList =
            this._utilities.linkedinPageList?.filter((x: any) => x?.isAccess);

          this._utilities.pageList = this._utilities.linkedinPageList?.filter(
            (x: any) => x?.type == 'page'
          );

          let filterArray = this._utilities.linkedinPageList?.filter(
            (x: any) => x?.type == 'profile'
          );

          if (filterArray?.length > 0) {
            this.selectedPageId = filterArray[0]._id;
          }

          this.setFormData();

          this._utilities.userData.isAISetting = true;
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
          let advanceSettingData =
            this.aiSettingForm.get('advanceSetting')?.value;

          let userAiSettingData = advanceSettingData?.find(
            (x: any) => x?.pageId == this._utilities?.userData?.currentPageId
          );

          this._utilities.userData.aiSetting.formality =
            userAiSettingData?.formality;
          this._utilities.chatGPTModel =
            this.aiSettingForm.get('chatGPTVersion')?.value;
          this.dialogRef.close();
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
        this.dialogRef.close();
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
    obj = { type, title };
    const asData = (this.aiSettingForm.get('advanceSetting') as FormArray).at(
      index
    );
    let keyword = asData.get('keyword')?.value?.map((obj: any) => obj?.value);
    let youAre = asData.get('about')?.value;
    if (keyword && youAre) {
      obj = {
        ...obj,
        keyword: keyword,
        youAre: youAre,
      };
    }
    this.dialogRefPlan = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRefPlan.afterClosed().subscribe((result: any) => {
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
      asData.get('targetAudience')?.setValue(data);
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
    this.dialogRefPlan = this._dialog.open(PlanUpgradeDialogComponent, {
      width: '550px',
      data: {},
    });

    this.dialogRefPlan.afterClosed().subscribe((result: any) => {
      if (result) {
        window.open('/subscription', '_blank');
      }
    });
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
