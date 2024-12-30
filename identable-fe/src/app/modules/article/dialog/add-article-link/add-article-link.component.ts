import { Component, Inject } from '@angular/core';

// LIBRARY
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { GeneralService } from '../../../../providers/general/general.service';

//UTILS
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-add-article-link',
  templateUrl: './add-article-link.component.html',
  styleUrls: ['./add-article-link.component.scss'],
})
export class AddArticleLinkComponent {
  isLinktype: any;

  // Article Link
  linkText: string = '';
  linkUrl: string = '';
  embedUrl: string = '';

  isSubmitLink: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddArticleLinkComponent>,
    private _generalService: GeneralService,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.isLinktype = this.data?.type;
  }

  generateLink() {
    this.isSubmitLink = true;
    if (this.isLinktype == 'link' && !this.linkText && !this.linkUrl) {
      return;
    }
    if (this.isLinktype == 'embed' && !this.embedUrl) {
      return;
    }
    if (this.isLinktype == 'embed') {
      let obj = {
        url: this.embedUrl,
      };
      this._loader.start();
      this._generalService.getLinkPreview(obj).subscribe(
        (response: ResponseModel) => {
          this._loader.stop();
          if (response.statusCode == 200) {
            this.dialogRef.close({ data: response.data });
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
    } else {
      let obj = {
        linkText: this.linkText,
        linkUrl: this.linkUrl,
      };
      this.dialogRef.close({ data: obj });
    }
  }
}
