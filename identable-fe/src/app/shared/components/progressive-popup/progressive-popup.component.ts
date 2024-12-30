import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-progressive-popup',
  templateUrl: './progressive-popup.component.html',
  styleUrls: ['./progressive-popup.component.scss'],
})
export class ProgressivePopupComponent {
  text: string = 'Loading...';

  progressBarWidth: number = 0;
  countdown: number = 0;
  interval: any = 0;
  duration: number = 300;

  constructor(private dialogRef: MatDialogRef<ProgressivePopupComponent>) {}
  ngOnInit() {
    this.progressBarWidth = 0;
    this.countdown = this.duration;

    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.text = 'Done!';
        this.dialogRef.close();
      } else {
        this.updateProgressBar();
      }
    }, 1000);
  }

  updateProgressBar() {
    this.progressBarWidth =
      ((this.duration - this.countdown) / this.duration) * 100;
  }
}
