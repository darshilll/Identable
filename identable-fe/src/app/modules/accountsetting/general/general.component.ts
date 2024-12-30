import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment-timezone';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {
  @Output() onSubmitGeneralSetting = new EventEmitter();

  @Input() data: any = {};
  selectedTimeZone: any;
  timezoneList = commonConstant.timeZoneArray;

  searchTimezone: string = '';
  filteredItems: any[] = [];

  constructor(
    public _userService: UserService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    // Get all timezones
    const allTimezones = moment.tz.names();

    // Create the array with timezone objects for all countries
    const resultArray = allTimezones.map((timezone) => {
      const timezoneName = timezone.replace(/_/g, ' ');
      return this.createTimezoneObject(timezone, timezoneName);
    });

    this.timezoneList = resultArray;
    this.filteredItems = this.timezoneList;
  }

  ngOnInit(): void {
    let browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('browserTimezone = ', browserTimezone);
    let city = browserTimezone.split('/');
    console.log('city = ', city);
    let filterArray = this.timezoneList?.filter((x: any) =>
      x?.name.includes(browserTimezone)
    );
    if (filterArray?.length > 0) {
      this.selectedTimeZone = filterArray[0]?.id;
    }
  }

  createTimezoneObject(id: string, name: string) {
    const offset = moment.tz(id).format('Z');
    return {
      id: id,
      name: `(GMT${offset}) ${name}`,
    };
  }

  searchData() {
    if (!this.searchTimezone.trim()) {
      this.filteredItems = this.timezoneList;
      return;
    }

    this.filteredItems = this.timezoneList.filter((item) =>
      item.name.toLowerCase().includes(this.searchTimezone.toLowerCase())
    );
  }

  choiceTimezone(value: any) {
    this.selectedTimeZone = value;
  }

  saveTimeZone() {
    if (!this.selectedTimeZone) {
      this.toastr.error('Please Select Timezone');
      return;
    }

    let obj = { timezone: this.selectedTimeZone };

    this.loaderService.start();
    this._userService.updateProfile(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.userData.isGeneral = true;

          this.toastr.success('Timezone updated successfully', '');
          setTimeout(() => {
            this.onSubmitGeneralSetting.emit();
          }, 2000);
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  onNextStep() {
    if (!this._utilities.userData?.isGeneral) {
      this.toastr.error('Please save timezone', '');
      return;
    }
    this.onSubmitGeneralSetting.emit();
  }
}
