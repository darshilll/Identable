import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { ArticleService } from '../../../../providers/article/article.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-idea-suggestion',
  templateUrl: './idea-suggestion.component.html',
  styleUrls: ['./idea-suggestion.component.scss'],
})
export class IdeaSuggestionComponent {
  isSubmited: boolean = false;
  ideaList: any;
  selectedIdea: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IdeaSuggestionComponent>,
    private _toastr: ToastrService,
    private _article: ArticleService,
    private _loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.getIdea();
  }

  getIdea() {
    let goal = this.data?.goal;
    this._loader.start();
    this._article.getArticleIdea({ goal: goal }).subscribe(
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

  submit() {
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
