import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

//services
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CrmCampaignService } from '../../../../providers/crm-campaign/crm-campaign.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-company-page-create-campaign',
  templateUrl: './company-page-create-campaign.component.html',
  styleUrls: ['./company-page-create-campaign.component.scss'],
})
export class CompanyPageCreateCampaignComponent {
  @Output() _back = new EventEmitter<any>();
  @Output() _notAllowContinue = new EventEmitter<any>();
  @Output() _createCampaign = new EventEmitter<any>();
  @Input() currentStep: number = 1;

  pageId: any;
  campaignName: any;
  campaignType: any;
  sourceUrl: any;
  isValidSourceUrl: any;
  hasErrorInput: any;
  age: any[] = [];
  industry: any[] = [];
  city: any[] = [];
  connectedIds:any[] = [];
  companyPageList: any;
  isAllowTheme: boolean = false;
  connectionCount: number = 0;

  isPremiumAccount: boolean = false;
  isInMailDiscover: boolean = false;
  isAlreadyTalkedPeople: boolean = false;

  ageList: any[] = [];
  industryList: any[] = [];
  cityList: any[] = [];

  constructor(
    public _utilities: CommonFunctionsService,
    private _toastr: ToastrService,
    private crmCampaignService: CrmCampaignService,
  ){
    this.getCityGroup();
    this.getIndustryGroup();
    this.getAgeGroup();

    let pageList = this._utilities.linkedinPageList;
    this.companyPageList = pageList?.filter(
      (x: any) => x?.type == 'page' && x?.isAccess
    );
    let planData = this._utilities?.userData?.plan;
    console.log("this._utilities",this._utilities);
    if (planData?.isCRMCompanySearchAllow){
      this.isAllowTheme = true;
    }
  }

  getCityGroup(){
    let param = {};
    this.crmCampaignService.getCityGroup(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.cityList = response?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getIndustryGroup(){
    let param = {};
    this.crmCampaignService.getIndustryGroup(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.industryList = response?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getAgeGroup(){
    let param = {};
    this.crmCampaignService.getAgeGroup(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.ageList = response?.data;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStep']) {
      if (this.currentStep == 1 && !this.companyPageList?.length) {
        this._notAllowContinue.emit({ notAllowNext: true });
      }

      if (this.currentStep == 2 && !this.pageId) {
        this._back.emit({ currentStep: 1 });
        this.hasErrorInput = 'pageId';
        this.currentStep = 1;
      }
      if (this.currentStep == 3 && !this.campaignName) {
        this._back.emit({ currentStep: 2 });
        this.hasErrorInput = 'campaignName';
        this.currentStep = 2;
      }

      // if (
      //   this.currentStep == 4        
      // ) {
      //   this._back.emit({ currentStep: 3 });
      //   this.currentStep = 3;
        
      //  if (!this.age?.length) {
      //     this.hasErrorInput = 'age';
      //     return;
      //   }
      //   if (!this.industry?.length) {
      //     this.hasErrorInput = 'industry';
      //     return;
      //   }
      //   if (!this.city?.length) {
      //     this.hasErrorInput = 'city';
      //     return;
      //   }
      // }

      //!this.campaignType || !this.sourceUrl || !this.validateUrl()
      if (
        this.currentStep == 4 &&
        this.isAllowTheme &&
        (!this.campaignType)
      ) {
        this._back.emit({ currentStep: 3 });
        this.currentStep = 3;
        if (!this.campaignType) {
          this.hasErrorInput = 'campaignType';
          return;
        }
        // if (!this.sourceUrl) {
        //   this.hasErrorInput = 'sourceUrl';
        //   return;
        // }
        // if (!this.isValidSourceUrl) {
        //   this.hasErrorInput = 'validSourceUrl';
        //   return;
        // }
      }

      if (this.currentStep > 4) {
        this._back.emit({ currentStep: 4 });

        // result city
        
        const resultCity:any[] = this.city.map(item => {
          var findCityIndex = this.cityList.findIndex((subItem: any) => subItem?.group === item); 
          if(findCityIndex != -1)
          {
            return this.cityList[findCityIndex]?.data;
          }
        });

        if(resultCity?.length > 0)
        {
          this.connectedIds = [
            ...this.connectedIds,
            ...resultCity[0],            
          ];  
        }

        // result industry

        const resultIndustry:any[] = this.industry.map(item => {
          var findIndustryIndex = this.industryList.findIndex((subItem: any) => subItem?.group === item); 
          if(findIndustryIndex != -1)
          {
            return this.industryList[findIndustryIndex]?.data;
          }
        });

        if(resultIndustry?.length > 0)
        {
          this.connectedIds = [
            ...this.connectedIds,
            ...resultIndustry[0],            
          ];  
        }
        
        // result industry

        const resultAge:any[] = this.age.map(item => {
          var findAgeIndex = this.ageList.findIndex((subItem: any) => subItem?.group === item); 
          if(findAgeIndex != -1)
          {
            return this.ageList[findAgeIndex]?.data;
          }
        });

        if(resultAge?.length > 0)
        {
          this.connectedIds = [
            ...this.connectedIds,
            ...resultAge[0]
          ];          
        }
        
        let payload = {};
        payload = {
          pageId: this.pageId,
          campaignName: this.campaignName,
          connectedIds: this.connectedIds,
          //age: this.age,
          //industry: this.industry,
          //city: this.city,
          //isPremiumAccount: this.isPremiumAccount,
          //isInMailDiscover: this.isInMailDiscover,
          //isAlreadyTalkedPeople: this.isAlreadyTalkedPeople,
        };
        
        if (this.isAllowTheme) {
          payload = {
            ...payload,
            campaignType: this.campaignType,
            searchUrl: this.sourceUrl,
          };
        }
        this._createCampaign.emit(payload);
      }
    } else {
      if (this.currentStep == 0) {
        this._back.emit();
      }
    }
  }

  checkError(input: any) {
    if (input == this.hasErrorInput) {
      return true;
    }
    return false;
  }

  selectCampaignType(page: any) {
    this.pageId = page?._id;
  }

  onAgeChange(event: any) {
    const isChecked = event.target.checked;
    const value     = event.target.value;
    const ageConnection = this.ageList?.find((x: any) => x?.group === value);
    if (isChecked) {
      this.age.push(value);
      if (ageConnection?.count) {
        this.connectionCount += ageConnection?.count;
      }
    } else {
      const index = this.age.indexOf(value);
      if (index > -1) {
        this.age.splice(index, 1);
        if (ageConnection?.count) {
          this.connectionCount -= ageConnection?.count;
        }
      }
    }
  }

  onIndustryChange(event: any) {
    const isChecked = event.target.checked;
    const value = event.target.value;
    const industryConnection = this.industryList?.find(
      (x: any) => x?.group == value
    );
    if (isChecked) {
      this.industry.push(value);
      if (industryConnection?.count) {
        this.connectionCount += industryConnection?.count;
      }
    } else {
      const index = this.industry.indexOf(value);
      if (index > -1) {
        this.industry.splice(index, 1);
        if (industryConnection?.count) {
          this.connectionCount -= industryConnection?.count;
        }
      }
    }
  }

  onCityChange(event: any) {
    const isChecked = event.target.checked;
    const value = event.target.value;
    const city  = this.cityList?.find((x: any) => x?.group == value);
    if (isChecked) {
      this.city.push(value);
      if (city?.count) {
        this.connectionCount += city?.count;
      }
    } else {
      const index = this.city.indexOf(value);
      if (index > -1) {
        this.city.splice(index, 1);
        if (city?.count) {
          this.connectionCount -= city?.count;
        }
      }
    }
  }

  validateUrl() {
    const pattern = /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/;
    this.isValidSourceUrl = pattern.test(this.sourceUrl);
    return this.isValidSourceUrl;
  }

  checkData(type: any, value: any) {
    if (type == 'industry') {
      return this.industry.includes(value);
    }
    if (type == 'age') {
      return this.age.includes(value);
    }
    if (type == 'city') {
      return this.city.includes(value);
    }
    return false;
  }
}
