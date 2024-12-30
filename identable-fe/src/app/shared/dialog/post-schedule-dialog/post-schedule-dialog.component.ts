import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { formatDate } from '@angular/common';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-post-schedule-dialog',
  templateUrl: './post-schedule-dialog.component.html',
  styleUrls: ['./post-schedule-dialog.component.scss'],
})
export class PostScheduleDialogComponent {
  @Input() data: any;
  @Input() boostingPost: boolean = false;
  @Input() isAdvancedSchedule: boolean = false;
  @Output() _closeDailog = new EventEmitter<any>();
  @Output() _postScheduled = new EventEmitter<any>();

  isScheduleCredit: number = 0;

  timeSlot: any = commonConstant.timeSlotList;
  timePeriod: any = commonConstant.timePeriod;

  isSelectedTimePeriod: any = 'Morning';
  isSelectedTimeSlot: any;
  isSelectedTime: any;
  isSelectedDate: any;

  availableSloat: any;
  defaultDate!: Date;

  isNextBtnDisabled: boolean = false;
  btnLable: string = 'Next';
  currentDate = new Date();

  isSelectdProfile: any;
  userDesignation: any;
  isPostScheduled: boolean = false;

  schedulePost_step1: boolean = true;
  schedulePost_step2: boolean = false;
  schedulePost_step3: boolean = false;
  schedulePost_step4: boolean = false;

  isDefultDateSelected: boolean = false;

  boostType: any = [
    {
      likes: 10,
      comments: 10,
      repost: 1,
    },
    {
      likes: 20,
      comments: 10,
      repost: 2,
    },
    {
      likes: 30,
      comments: 15,
      repost: 3,
    },
    {
      likes: 40,
      comments: 20,
      repost: 4,
    },
  ];
  boosTypeIndex: Number = 0;
  boosTypeSelected: any = {
    likes: 10,
    comments: 10,
    repost: 1,
  };

  isAdvancedScheduleCredit: number = 0;
  isAdvancedScheduleCreditMsg: any;

  constructor(public _utilities: CommonFunctionsService) {
    // this.isScheduleCredit =
    //   this._utilities?.userData?.subscription?.credit;
  }

  ngOnInit(): void {
    let currentDate = new Date();
    this.defaultDate = currentDate;
    this.availableSloat = currentDate;
    this.isSelectedDate = formatDate(currentDate, 'dd/MM/yyyy', 'en-US');
    // this.isSelectdProfile = this.commonService?.linkedProfileList[0];
    // this.userDesignation = this.commonService?.userLinkedInData?.designation;
    var userLinkedInData: any = localStorage.getItem('userLinkedInData');
    // this.currentActiveProfile = JSON.parse(userLinkedInData);
    if (this.data?.timestamp && this.data?.timeSlot && this.data?.timePeriod) {
      this.defaultDate = new Date(this.data?.timestamp);
      const date = new Date(this.data?.timestamp);
      this.isSelectedDate = formatDate(date, 'dd/MM/yyyy', 'en-US');
      this.availableSloat = this.data?.timestamp;
      this.isDefultDateSelected = true;
    }
    this.isAdvancedScheduleCredit =
      this._utilities?.userData?.plan?.advancedScheduleCredit;
    this.isAdvancedScheduleCreditMsg = `This will cost ${this.isAdvancedScheduleCredit} credits`;
  }

  close() {
    this._closeDailog.emit();
  }

  setBestPostTime() {
    let bestPostTime = this._utilities.userData?.bestPostTime;
    bestPostTime.forEach((postTime: any) => {
      const [time, meridiem] = postTime.split(' ');
      this.timeSlot.forEach((slot: any) => {
        if (slot.meridiem === meridiem) {
          slot.time.forEach((t: any) => {
            if (t.time === time) {
              t.isBestPostTime = true;
            }
          });
        }
      });
    });
  }

  schedulePostStep(direction: boolean, index?: any) {
    this.isNextBtnDisabled = false;
    if (this.schedulePost_step1) {
      if (!direction) {
        return;
      }
      this.setBestPostTime();
      this.setAvailableTimeSloat(this.availableSloat);
      this.schedulePost_step2 = true;
      this.schedulePost_step1 = false;
      if (!this.isSelectedTimeSlot) {
        this.isNextBtnDisabled = true;
      }
      if (!this.boostingPost) {
        this.btnLable = direction ? 'Save' : 'Next';
      }
      return;
    }
    if (this.schedulePost_step2) {
      if (direction) {
        this.btnLable = direction ? 'Save' : 'Next';
        if (this.boostingPost) {
          this.schedulePost_step2 = false;
          this.schedulePost_step3 = true;
        } else {
          this.schedulePost_step1 = false;
          this.schedulePost_step2 = true;
          this.postScheduled();
        }
      } else {
        this.btnLable = direction ? 'Save' : 'Next';
        this.schedulePost_step1 = true;
        this.schedulePost_step2 = false;
      }
      return;
    }
    if (this.schedulePost_step3) {
      if (direction) {
        this.postScheduled();
      } else {
        this.btnLable = direction ? 'Save' : 'Next';
        this.schedulePost_step2 = true;
        this.schedulePost_step3 = false;
      }
      return;
    }
    // if (this.schedulePost_step4) {
    //   if (!direction) {
    //     this.schedulePost_step2 = true;
    //   } else {
    //     this.schedulePost_step3 = direction ? false : true;
    //   }
    //   this.schedulePost_step4 = false;
    //   this.schedulePost_step1 = direction ? true : false;
    //   if (direction) {
    //     this.savePost();
    //   }
    //   return;
    // }
  }

  postScheduled() {
    let isTime = this.isSelectedTime + ' ' + this.isSelectedTimeSlot?.meridiem;
    let convertedTime = this.convertTo24HourFormat(isTime);
    const inputDate = this.isSelectedDate + ' ' + convertedTime;
    let timestamp = this.convertToTimestamp(inputDate);
    let obj = {
      timestamp: timestamp,
      timeSlot: isTime,
      timePeriod: this.isSelectedTimePeriod,
      isSelectdProfile: this.isSelectdProfile,
      boosTypeSelected: this.boosTypeSelected,
      boostingPost: this.boostingPost,
    };

    this._postScheduled.emit(obj);
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

    if (
      this.data?.timestamp &&
      this.data?.timeSlot &&
      this.data?.timePeriod &&
      this.isDefultDateSelected
    ) {
      this.isSelectedTimePeriod = this.data?.timePeriod;
      let index = this.timePeriod.findIndex(
        (x: any) => x.period === this.data?.timePeriod
      );
      this.isSelectedTimeSlot = this.timeSlot[index];
      this.isSelectedTime = this.data?.timeSlot.split(' ')[0];
    }
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

  selectBootType(boot: any, index: any) {
    this.boosTypeIndex = index;
    this.boosTypeSelected = boot;
  }

  selectProfile(profile: any) {
    this.isSelectdProfile = profile;
  }
}
