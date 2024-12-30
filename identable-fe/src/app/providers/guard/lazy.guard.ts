import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LazyGuard implements CanLoad {
  public token: any;
  constructor(private router: Router) {}

  canLoad(route: Route): boolean {
    return this.checkSession(route);
  }

  checkSession(route:any) {
    this.token = localStorage.getItem('token');
    if (this.token != undefined) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  } //Check Session ends here

  redirectRoute() {
    this.router.navigate([environment.defaultPath]);
  } //Redirect
}
