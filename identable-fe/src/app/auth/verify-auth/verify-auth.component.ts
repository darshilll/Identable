import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-auth',
  templateUrl: './verify-auth.component.html',
  styleUrls: ['./verify-auth.component.scss'],
})
export class VerifyAuthComponent {
  constructor(private route: ActivatedRoute) {
    let cookies = this.route.snapshot.queryParamMap.get('cookies');
    window.location.href = '/account-setting?cookies=' + cookies;
  }
}
