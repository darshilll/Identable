import { Component, Input, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
@Component({
  selector: 'app-time-dialog',
  templateUrl: './time-dialog.component.html',
  styleUrls: ['./time-dialog.component.scss'],
})
export class TimeDialogComponent {
  isSelectedTimePeriod: any = 'Morning';
  isSelectedTimeSlot: any;
  isSelectedTime: any;

  isSelectedDate: any;
  availableSloat: any;
  defaultDate!: Date;

  timeSlot: any = commonConstant.timeSlotList;
  timePeriod: any = commonConstant.timePeriod;

  isSelectdProfile: any;
  userDesignation: any;
  isPostScheduled: boolean = false;

  isDefultDateSelected: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TimeDialogComponent>
  ) {}

  ngOnInit(): void {
    let currentDate = new Date();
    this.defaultDate = new Date(this.data?.date);
    this.isSelectedDate = formatDate(this.defaultDate, 'dd/MM/yyyy', 'en-US');
    this.availableSloat = new Date(this.data?.date);
    this.isDefultDateSelected = true;
    this.setAvailableTimeSloat(this.availableSloat);
  }

  setAvailableTimeSloat(date: any) {
    for (let index = 0; index < this.timePeriod.length; index++) {
      const timePeriod = this.timePeriod[index];
      timePeriod.isAvailable = true;
      for (let j = 0; j < this.timeSlot[index].time.length; j++) {
        const timeSlot = this.timeSlot[index];
        timeSlot.time[j].isAvailable = true;
      }
    }

    let d = new Date(date);
    for (let index = 0; index < this.timePeriod.length; index++) {
      let timeInPast = false;
      const timePeriod = this.timePeriod[index];
      timePeriod.isAvailable = true;
      for (let j = 0; j < this.timeSlot[index].time.length; j++) {
        const timeSlot = this.timeSlot[index];
        timeSlot.time[j].isAvailable = true;
        let formatTime = this.convertTo24HourFormat(
          timeSlot.time[j].time + ' ' + timeSlot.meridiem
        );

        let hoursMinutes = formatTime.split(':');
        d.setHours(Number(hoursMinutes[0]));
        d.setMinutes(Number(hoursMinutes[1]));

        const currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + 10);
        timeInPast = d.getTime() < currentTime.getTime();

        timeSlot.time[j].isAvailable = timeInPast ? false : true;

        if (!timeInPast) {
          this.isSelectedTime = timeSlot.time[j].time;
          break;
        }
      }

      if (timeInPast) {
        timePeriod.isAvailable = false;
      } else {
        this.isSelectedTimeSlot = this.timeSlot[index];
        this.isSelectedTimePeriod = timePeriod.period;
        break;
      }
    }

    this.isSelectedTimePeriod = this.data?.timePeriod;
    let index = this.timePeriod.findIndex(
      (x: any) => x.period === this.data?.timePeriod
    );
    this.isSelectedTimeSlot = this.timeSlot[index];
    this.isSelectedTime = this.data?.timeSlot.split(' ')[0];
  }

  selectTime(period: any, type: string) {
    if (type == 'timeslot') {
      this.isSelectedTimePeriod = period;
      let index = this.timePeriod.findIndex((x: any) => x.period === period);
      this.isSelectedTimeSlot = this.timeSlot[index];
      this.isSelectedTime = this.isSelectedTimeSlot.time.find(
        (item: any) => item.isAvailable == true
      ).time;
    }
    if (type == 'time') {
      this.isSelectedTime = period;
    }
  }

  convertTo24HourFormat(time12h: string): string {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':');

    let hours24 = parseInt(hours, 10);

    if (period === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (period === 'AM' && hours24 === 12) {
      hours24 = 0;
    }

    const formattedHours = hours24.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  convertToTimestamp(dateTimeString: string): number {
    const [dateString, timeString] = dateTimeString.split(' ');
    const [day, month, year] = dateString.split('/');
    const [hours, minutes] = timeString.split(':');

    const dateObject = new Date(+year, +month - 1, +day, +hours, +minutes);
    const timestamp = dateObject.getTime();

    return timestamp;
  }

  onSelectMethod(event: any) {
    let d = new Date(Date.parse(event));
    this.isSelectedDate = `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()}`;
    this.availableSloat = new Date(d).getTime();
    this.defaultDate = d;
    this.isDefultDateSelected = false;
  }

  submit() {
    let isTime = this.isSelectedTime + ' ' + this.isSelectedTimeSlot?.meridiem;
    let obj = {
      timePeriod: this.isSelectedTimePeriod,
      timeSlot: isTime,
    };
    this.dialogRef.close(obj);
  }
  cancel() {
    this.dialogRef.close();
  }
}
