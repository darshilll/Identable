import { Component,Inject} from '@angular/core';

// LIBRARY
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { GiphyService } from '../../../../providers/giphy/giphy.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';
import { GeneralService } from 'src/app/providers/general/general.service';

//UTILS
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-set-background-image',
  templateUrl: './set-background-image.component.html',
  styleUrls: ['./set-background-image.component.scss'],
})
export class SetBackgroundImageComponent {
  selectUploadOption: any = 'premium';

  // Pixel Image
  allfetchtrendingPixelList: any;
  serchImage: string = '';

  aiImageList: any;

  gradientImage: any = [
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-1.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-2.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-3.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-4.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-5.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-6.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-7.jpg',
    'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-8.jpg',
  ];
  isGenrated: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SetBackgroundImageComponent>,
    private giphyService: GiphyService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    public _aiImage: AiImageService,
    public _generalService: GeneralService
  )
  {
    this.isGenrated = this.data?.isGenrated;
  }

  ngOnInit(): void {
    this._loader.start();
    setTimeout(() => {
      this._loader.stop();
      this.getAiImage();
    }, 500);
  }

  choiceUploadOption(value: any) {
    this.selectUploadOption = value;
    this.serchImage = '';
    if (value === 'searchMedia') {
      this.fetchtrendingPixelPhoto();
    }
  }

  // Search By Pixel

  searchVideoAndImage() {
    if (this.serchImage) {
      this.fetchtrendingPixelPhoto(this.serchImage);
    }
  }

  fetchtrendingPixelPhoto(serchImage?: any) {
    this._loader.start();
    this.giphyService.fetchtrendingPixelPhoto(serchImage).subscribe(
      (response) => {
        this.allfetchtrendingPixelList = response?.photos;
        this._loader.stop();
      },
      (err) => {
        this._toastr.error('Please try again.');
        this._loader.stop();
      }
    );
  }

  // Select image
  selectBgContentImg(data: any) {
    let result = { imageUrl: data };
    this.dialogRef.close(result);
  }

  getAiImage() {
    this._loader.start();
    this._aiImage.getAiImage({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.aiImageList = response?.data;
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

  selectImage(imageUrl: any) {
    this.dialogRef.close({ imageUrl: imageUrl });
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
            this._loader.stop();
            this.dialogRef.close({ imageUrl: response?.data[0]?.url });
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
  
}
