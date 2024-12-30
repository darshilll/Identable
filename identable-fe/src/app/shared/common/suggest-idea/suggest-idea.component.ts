import { Component, Inject, OnInit } from '@angular/core';

// LIBRARY
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-suggest-idea',
  templateUrl: './suggest-idea.component.html',
  styleUrls: ['./suggest-idea.component.scss']
})
export class SuggestIdeaComponent {

  // Suggest Idea
  ideaList:any;
  selectedIdea:any;
  isSubmited: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuggestIdeaComponent>,
    private _toastr: ToastrService,    
    private _loader: LoaderService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService
  )
  {
    this.ideaList = this.data?.data;    
  }

  getAIImageIdea() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    let payload = {};
    this._aiImage.getAIImageIdea(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.ideaList = response?.data?.data; 
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

  onSubmit() {
    this.isSubmited = true;
    if (!this?.selectedIdea) {
      return;
    }
    this.dialogRef.close({ idea: this.selectedIdea });
  }

  selectIdea(idea: any) {
    this.selectedIdea = idea;
  }

}
