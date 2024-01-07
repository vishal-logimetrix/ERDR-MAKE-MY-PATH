import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree,
  CanLoad,
  Router
} from '@angular/router';
import { LoginService } from '../core/services/login.service';
import { PermissionsService } from '../core/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private login: LoginService
  ) { }

  canLoad(): boolean {
    if (this.permissions.isauthenticated() && this.permissions.isStudent()) {
      return true;
    }
    else if (this.permissions.isauthenticated() && !this.permissions.isStudent()) {
      this.router.navigate(['/']);
    } 
    else {
      var params = window.location.search.split('?');
      if (params) {
        this.login.setLoginRedirect(window.location.pathname + window.location.search);
        this.login.loginRedirectUrl = window.location.pathname + window.location.search;
      }
      else {
        this.login.setLoginRedirect(window.location.pathname);
        this.login.loginRedirectUrl = window.location.pathname;
      }
      // this.router.navigate(['/']);
      return true;
    }
  }
}
