import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { GeneralService } from 'src/app/providers/general/general.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-generate-common-prompt',
  templateUrl: './generate-common-prompt.component.html',
  styleUrls: ['./generate-common-prompt.component.scss'],
})
export class GenerateCommonPromptComponent {
  selectedKeywords: string[] = [];
  yourself: any;
  errorText: string = '';
  dialogType: any;
  dialogTitle: string = 'Identable';
  aiGeneratedData: any;
  isSelectIndex: any;
  selectedTopic: any;
  isSubmited: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GenerateCommonPromptComponent>,
    private _generalService: GeneralService,
    private ngxLoader: LoaderService,
    private toastrService: ToastrService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    this.dialogType = this.data?.type;
    this.dialogTitle = this.data?.title ? this.data?.title : 'Identable';
  }

  ngOnInit(): void {
    this.generateCommonPrompt(this.dialogType);
  }

  generateCommonPrompt(type: any) {
    let params = {};
    params = {
      promptAction: type,
      designation: this._utilities?.linkedinProfileData?.designation,
      pageId: this.data?.pageId,
      pointOfView: this.data?.pointOfView,
    };
    if (this.data?.keyword && this.data?.youAre) {
      params = {
        ...params,
        keyword: this.data?.keyword,
        youAre: this.data?.youAre,
      };
    }
    let isChatGPTVersion = this._utilities.chatGPTModel;
    console.log("[[[[",isChatGPTVersion);
    
    this.loaderService.start(isChatGPTVersion);
    this._generalService.commonPrompt(params).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          if (type == 'keyword') {
            this.aiGeneratedData = response?.data?.data;
          } else if (type == 'yourself') {
            if (response?.data?.data?.length > 0) {
              this.aiGeneratedData = response?.data?.data[0].yourself;
              this.yourself = response?.data?.data[0].yourself;
            }
          } else if (type == 'targetAudience') {
            this.aiGeneratedData = response?.data?.data;
          } else if (type == 'objective') {
            this.aiGeneratedData = response?.data?.data;
          } else if (type == 'callOfAction') {
            this.aiGeneratedData = response?.data?.data;
          } else if (type == 'topic') {
            this.aiGeneratedData = response?.data?.data;
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

    // this.opanAiService.generateCommonPrompt(obj).subscribe(
    //   (response) => {
    //     if (response?.data) {
    //       if (type == 'keyword') {
    //         this.aiGeneratedData = response?.data;
    //       }
    //       if (type == 'yourself') {
    //         this.aiGeneratedData = response?.data[0].yourself;
    //         this.yourself = response?.data[0].yourself;
    //       }
    //       if (type == 'targetAudience') {
    //         this.aiGeneratedData = response?.data;
    //       }
    //       if (type == 'objective') {
    //         this.aiGeneratedData = response?.data;
    //       }
    //       if (type == 'callOfAction') {
    //         this.aiGeneratedData = response?.data;
    //       }
    //     }
    //   },
    //   (err) => {
    //     this.loaderText = err?.error?.message;
    //   }
    // );
  }
  useTopic() {
    this.isSubmited = true;
    if (this.dialogType == 'yourself') {
      if (!this.yourself) {
        this.errorText = 'Please add something about yourself';
        return;
      }
      this.dialogRef.close(this.yourself);
    } else if (this.dialogType == 'keyword') {
      if (this.selectedKeywords?.length == 0) {
        this.errorText = 'Please select Keyword';
        return;
      }
      this.dialogRef.close(this.selectedKeywords);
    } else if (this.dialogType == 'targetAudience') {
      if (this.selectedKeywords?.length == 0) {
        this.errorText = 'Please select target audience';
        return;
      }
      this.dialogRef.close(this.selectedKeywords);
    } else {
      if (!this.selectedTopic) {
        this.errorText = `Please select any ${this.dialogType}`;
        return;
      }
      this.dialogRef.close(this.selectedTopic);
    }
  }

  selectKeyword(event: any) {
    const isChecked = event.target.checked;
    const value = event.target.value;

    if (isChecked) {
      if (this.selectedKeywords?.length < 3) {
        this.selectedKeywords.push(value);
      } else {
        this.toastrService.error('You can select a maximum of three tag.');
        event.preventDefault();
        return;
      }
    } else {
      const index = this.selectedKeywords.indexOf(value);
      if (index !== -1) {
        this.selectedKeywords.splice(index, 1);
      }
    }
  }

  selectTopic(index: any) {
    this.isSelectIndex = index;
    this.selectedTopic = this.aiGeneratedData[index]?.data;
  }
}
