import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public token: any;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
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
  } //Redirect Route ends here
} //Main Class ends here
