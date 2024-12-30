import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-play-intro-video',
  templateUrl: './play-intro-video.component.html',
  styleUrls: ['./play-intro-video.component.scss'],
})
export class PlayIntroVideoComponent implements OnInit {
  progressBarWidth: number = 0;
  countdown: number = 0;
  interval: any = 0;
  minutes: number = 0;
  seconds: number = 0;

  displayMinutes: string = '';
  displauSeconds: string = '';

  duration: number = 120;

  dataStatus: string = '';

  constructor(
    public _utilities: CommonFunctionsService,
    private dialogRef: MatDialogRef<PlayIntroVideoComponent>
  ) {
    this._utilities.refreshPlayIntroData = new Subject();
    this._utilities.refreshPlayIntroData.subscribe((response: any) => {
      console.log('refreshPlayIntroData response = ', response);
      if (response) {
        this.dataStatus = 'success';
      } else {
        this.dataStatus = 'failed';
      }
    });
  }

  ngOnInit() {
    this.progressBarWidth = 0;
    this.countdown = this.duration;

    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.interval);
        if (this.dataStatus == '') {
          setTimeout(() => {
            this.dataStatus = 'failed';
          }, 10000);
        }
      } else {
        this.updateProgressBar();
        this.calculateTime();
      }
    }, 1000);
  }

  updateProgressBar() {
    this.progressBarWidth =
      ((this.duration - this.countdown) / this.duration) * 100;
  }

  calculateTime() {
    this.minutes = Math.floor(this.countdown / 60);
    this.seconds = this.countdown % 60;

    this.displayMinutes = this.padWithZero(this.minutes);
    this.displauSeconds = this.padWithZero(this.seconds);
  }

  padWithZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onContinue() {
    this.dialogRef.close();
  }

  onSupport() {
    window.open('https://identableclub.canny.io/bugs', '_blank');
  }

  onTryAgain() {
    this.dialogRef.close({ action: 'try_again' });
  }
}
