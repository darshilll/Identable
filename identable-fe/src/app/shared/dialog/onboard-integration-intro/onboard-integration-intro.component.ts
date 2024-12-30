import { Component } from '@angular/core';

@Component({
  selector: 'app-onboard-integration-intro',
  templateUrl: './onboard-integration-intro.component.html',
  styleUrls: ['./onboard-integration-intro.component.scss']
})
export class OnboardIntegrationIntroComponent {

  // Slider Config
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };

  constructor(){
    
  }
}
