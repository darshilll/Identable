import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';

// COMPONENTS
import { MobilePromptDialogComponent } from './shared/common/mobile-prompt-dialog/mobile-prompt-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ifHeader: boolean = true;
  dialogRef: any = null;
  constructor(
    private router: Router,
    public location: Location,
    private _dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  )
  {
    this.ifHeader = false;

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (
          val['urlAfterRedirects'].indexOf('/auth/login') >= 0 ||
          val['urlAfterRedirects'].indexOf('/auth/signup') >= 0 ||
          val['urlAfterRedirects'].indexOf('/auth/verify-email') >= 0 ||
          val['urlAfterRedirects'].indexOf('/auth/forgot-password') >= 0 ||
          val['urlAfterRedirects'].indexOf('/auth/resetpassword') >= 0 ||
          val['urlAfterRedirects'].indexOf('/onboarding') >= 0 ||
          val['urlAfterRedirects'].indexOf('/account-setting') >= 0 ||
          val['urlAfterRedirects'].indexOf('/subscription') >= 0 ||
          val['urlAfterRedirects'].indexOf('/auth/login?code') >= 0 ||
          val['urlAfterRedirects'].indexOf('/carousels-maker') >= 0 ||
          val['urlAfterRedirects'].indexOf('/visual-creative/carousel') >= 0 ||
          val['urlAfterRedirects'].indexOf('/visual-creative/adcreative') >= 0 ||
          val['urlAfterRedirects'].indexOf('/linkedin-verify-authentication') >=
            0
        ) {
          this.ifHeader = false;
        } else {
          this.ifHeader = true;
        }
      }
    });

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        if (result.matches) {
          this.dialogRef = this._dialog.open(MobilePromptDialogComponent, {
            width: '500px',
            data: {},
          });
        } else {
          if (this.dialogRef) {
            this.dialogRef.close();
          }
        }
      });
  }
}
