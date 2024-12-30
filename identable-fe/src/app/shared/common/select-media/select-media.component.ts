import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';

//services
import { GiphyService } from '../../../providers/giphy/giphy.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { AiImageService } from 'src/app/providers/aiImage/ai-image.service';

// Component
import { SuggestIdeaComponent } from '../suggest-idea/suggest-idea.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-select-media',
  templateUrl: './select-media.component.html',
  styleUrls: ['./select-media.component.scss']
})
export class SelectMediaComponent {

  // Custom Tabs
  choiceMediaTabs: any = [
    {
      lable: 'Upload Media',
      icon: 'assets/images/upload-icon-24.png',
      isComming: false
    },
    {
      lable: 'Ai image',
      icon: 'assets/images/icon-stars-24.png',
      isComming: false
    },
    {
      lable: 'Pexels',
      icon: 'assets/images/pixels-icon.png',
      isComming: false
    },
    {
      lable: 'Giphy',
      icon: 'assets/images/image-giphy-24.png',
      isComming: false
    }    
  ]
  choiceMediaOptions:any = 'Upload Media';

  // Assign Data
  pixelImagelist: any;
  pixelVideolist: any;

  serchPixelByText: string = '';
  serchPixelType: string = 'image';

  // Giphy
  allGiphyList:any;  
  searchGiphyQuery: string = '';
  
  // Media pagignation
  mediaPage:number  = 1;
  medialimit:number = 6;

  // Recents uploaded media
  recentMedia:any;
  isDragging: boolean = false;

  // Ai Genrated Image
  genratedImageList:any;
  genratedImageForm: FormGroup;
  submitted:boolean = false;

  creditDeducated: number = 0;
  creditMessage: any;

  // Suggest idea dialog
  suggestDialogRef:any;
  constructor(
    private dialogRef: MatDialogRef<SelectMediaComponent>,
    private _dialog: MatDialog,
    private giphyService: GiphyService,
    private _loader: LoaderService,
    private formBuilder: FormBuilder,
    private _toastr: ToastrService,
    public _generalService: GeneralService,
    public _utilities: CommonFunctionsService,
    public _aiImage: AiImageService
  ){
    this.genratedImageForm = this.formBuilder.group({ 
      topic: ['',[Validators.required]],
      imageStyle: ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getMediaList();
    this.fetchtrendingPixelPhoto();
    this.fetchtrendingPopularVideo();
    this.fetchtrendingGiphy();
    this.getAiImage();
    this.creditDeducated = this._utilities?.userData?.plan?.aiImageCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.genratedImageForm.controls[controlName].hasError(errorName);
  };

  changeTheTabs(val:any){
    this.choiceMediaOptions = val?.lable;
  }
  
  // Get genrated image list

  getAiImage() {
    this._loader.start();
    this._aiImage.getAiImage({}).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.genratedImageList = response?.data;
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
  
  // Genrated Ai image

  generateImage() {

    this.submitted = true;
    if (!this.genratedImageForm.valid) {
      return;
    }

    const { topic,imageStyle } = this.genratedImageForm.value;

    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);
    
    let payload = {
      topic: topic,
      imageStyle: imageStyle
    };
    this._aiImage.generateImage(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.creditDeducated);
          this.getAiImage();          
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

  // Get Ai image idea

  getAIImageIdea() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    let payload = {};
    this._aiImage.getAIImageIdea(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.openSuggestDailog(response.data);
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

  openSuggestDailog(suggestData: any) {
    this.suggestDialogRef = this._dialog.open(SuggestIdeaComponent, {
      width: '650px',
      data: suggestData,
    });
    this.suggestDialogRef.afterClosed().subscribe((result: any) => {
      if (result) { 
        this.genratedImageForm.get('topic')?.setValue(result?.idea);      
      }
    });   
  }

  getMediaList() {
    let obj = {
      page: this.mediaPage,
      limit: this.medialimit,
      mediaType: "image"
    };
    this._loader.start();
    this._generalService.getMediaList(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.recentMedia = response?.data;
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

  // Drag and drop image

  onDragOver(event: any) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: any) {
    this.isDragging = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    this.isDragging = false;
    
    const file = event.dataTransfer.files[0];

    // Define allowed MIME types for images and video
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi', 'video/mkv'];

    // Check if the file type is allowed
    if (!allowedTypes.includes(file.type)) {
        this._toastr.error('Only JPG, PNG, and video files are allowed');
        return;
    }
    
    if (file && file.type.indexOf('image') > -1 && file.size / 1024 / 1024 > 2) {
      this._toastr.error('File is bigger than 2MB');
      return;
    }
    
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this._loader.start();
      const formData = new FormData();
      formData.append('file', file, file.name);      

      this._generalService.uploadFile(formData).subscribe(
        (response) => {
          this._loader.stop();
          if (response.statusCode === 200) {
            this._toastr.success('File uploaded successfully');
            // Handle successful upload
          } else {
            this._toastr.error('Failed to upload file');
          }
        },
        (error) => {
          this._loader.stop();
          this._toastr.error('Error during file upload');
        }
      );
    }
  }

  // Upload Custom Image

  uploadImage(event: any) {
    const file = event.target.files && event.target.files[0];

    // Define allowed MIME types for images and video
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi', 'video/mkv'];

    // Check if the file type is allowed
    if (!allowedTypes.includes(file.type)) {
        this._toastr.error('Only JPG, PNG, and video files are allowed');
        return;
    }

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
            this.dialogRef.close({ url: response?.data[0]?.url, type:'image'});
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
  
  choiceRecentImage(image:any){
    this.dialogRef.close({ url: image, type:'image'});
  }

  // Pixel Image

  onChangeSearchType(event: any) {
    this.serchPixelType = event.target.value;
  }

  addPexelsImageVideo(url: any) {
    if (url) {
      this.dialogRef.close({ url, type: this.serchPixelType });
    }
  }

  searchPixelVideoAndImage() {
    if (this.serchPixelByText) {
      this._loader.start();
      if (this.serchPixelType == 'image') {
        this.fetchtrendingPixelPhoto(this.serchPixelByText);
      } else {
        this.fetchtrendingPopularVideo(this.serchPixelByText);
      }
    }
  }

  fetchtrendingPixelPhoto(searchText?: any) {
    this.giphyService.fetchtrendingPixelPhoto(searchText).subscribe(
      (response) => {
        this.pixelImagelist = response?.photos;
        this._loader.stop();
      },
      (err) => {
        this._toastr.error('Please try again.');
        this._loader.stop();
      }
    );
  }

  fetchtrendingPopularVideo(searchText?: any) {
    this.giphyService.fetchtrendingPopularVideo(searchText).subscribe(
      (response) => {
        this.pixelVideolist = response?.videos;
        this._loader.stop();
      },
      (err) => {
        this._toastr.error('Please try again.');
        this._loader.stop();
      }
    );
  }

  // Fetch Giphy

  fetchtrendingGiphy() {
    let obj = {};
    this.giphyService.trendingGifs(obj).subscribe(
      (response) => {
        this.allGiphyList = response?.data;
      },
      (err) => {
        this._toastr.error('Please try again.');
      }
    );
  }

  searchGifs() {
    let obj = { searchQuery: this.searchGiphyQuery };
    this.allGiphyList = [];
    this.giphyService.searchGifs(obj).subscribe(
      (response) => {
        this.allGiphyList = response?.data;
      },
      (err) => {
        this._toastr.error('Please try again.');
      }
    );
  }

  selectGiphy(url: any) {
    if (url) {
      this.dialogRef.close({ url, type: 'giphy'});      
    }
  }

}
