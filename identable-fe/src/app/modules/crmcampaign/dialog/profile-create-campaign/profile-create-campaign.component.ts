import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'app-profile-create-campaign',
  templateUrl: './profile-create-campaign.component.html',
  styleUrls: ['./profile-create-campaign.component.scss'],
})
export class ProfileCreateCampaignComponent {
  @Output() _back = new EventEmitter<any>();
  @Output() _createCampaign = new EventEmitter<any>();
  @Input() currentStep: number = 1;

  campaignName: any;
  campaignType: any;
  hasErrorInput: any;
  sourceUrl: any;
  isValidSourceUrl: any;

  isPremiumAccount: boolean = false;
  isInMailDiscover: boolean = false;
  isAlreadyTalkedPeople: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStep']) {
      if (this.currentStep == 2 && !this.campaignName) {
        this._back.emit({ currentStep: 1 });
        this.hasErrorInput = 'campaignName';
        this.currentStep = 1;
      }

      if (
        this.currentStep == 3 &&
        (!this.campaignType || !this.sourceUrl || !this.validateUrl())
      ) {
        this._back.emit({ currentStep: 2 });
        this.currentStep = 2;
        if (!this.campaignType) {
          this.hasErrorInput = 'campaignType';
          return;
        }
        if (!this.sourceUrl) {
          this.hasErrorInput = 'sourceUrl';
          return;
        }
        if (!this.isValidSourceUrl) {
          this.hasErrorInput = 'validSourceUrl';
          return;
        }
      }

      if (this.currentStep > 3) {
        this._back.emit({ currentStep: 3 });
        this._createCampaign.emit({
          campaignName: this.campaignName,
          campaignType: this.campaignType,
          searchUrl: this.sourceUrl,
          isPremiumAccount: this.isPremiumAccount,
          isInMailDiscover: this.isInMailDiscover,
          isAlreadyTalkedPeople: this.isAlreadyTalkedPeople,
        });
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

  validateUrl() {
    const pattern = /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/;
    this.isValidSourceUrl = pattern.test(this.sourceUrl);
    return this.isValidSourceUrl;
  }
}
