import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { GiphyService } from '../../../providers/giphy/giphy.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

@Component({
  selector: 'app-pixel-image-video',
  templateUrl: './pixel-image-video.component.html',
  styleUrls: ['./pixel-image-video.component.scss']
})
export class PixelImageVideoComponent {

  allfetchtrendingPixelList: any;
  allfetchtrendingPixelListVideo: any;
  serchText: string = '';
  serchType: string = 'Photos';

  constructor(
    private dialogRef: MatDialogRef<PixelImageVideoComponent>,
    private giphyService: GiphyService,
    private toastrService: ToastrService,
    private ngxLoader: LoaderService
  ) { }

  ngOnInit(): void {
    this.fetchtrendingPixelPhoto();
    this.fetchtrendingPopularVideo();
  }

  fetchtrendingPixelPhoto(searchText?: any) {
    this.giphyService.fetchtrendingPixelPhoto(searchText).subscribe(
      (response) => {
        this.allfetchtrendingPixelList = response?.photos;
        this.ngxLoader.stop();
      },
      (err) => {
        this.toastrService.error('Please try again.');
        this.ngxLoader.stop();
      }
    );
  }

  fetchtrendingPopularVideo(searchText?: any) {
    this.giphyService.fetchtrendingPopularVideo(searchText).subscribe(
      (response) => {
        this.allfetchtrendingPixelListVideo = response?.videos;
        this.ngxLoader.stop();
      },
      (err) => {
        this.toastrService.error('Please try again.');
        this.ngxLoader.stop();
      }
    );
  }

  changeType(type: any) {
    this.serchType = type;
  }

  searchVideoAndImage() {
    if (this.serchText) {
      this.ngxLoader.start();
      if (this.serchType == 'Photos') {
        this.fetchtrendingPixelPhoto(this.serchText);
      } else {
        this.fetchtrendingPopularVideo(this.serchText);
      }
    }
  }
  
  addPexelsImageVideo(url: any) {
    if (url) {
      this.dialogRef.close({ url, type: this.serchType });
    }
  }

}
