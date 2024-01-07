import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { PermissionsService } from '../core/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateDashboardGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissions: PermissionsService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if (!this.permissions.isAssessmentelected()) {
    //   this.router.navigate(['/assessment/dashboard/select-assessment']);
    //   return false;

    // } else if (this.permissions.isauthenticated() && this.permissions.isProfileRequired()) {
    //   this.router.navigate(['/assessment/dashboard/profile']);
    //   return false;

    // } else {
    //   return true;
    // }
    return true;
  }
}
