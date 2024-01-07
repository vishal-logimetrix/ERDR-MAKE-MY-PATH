import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { PermissionsService } from '../core/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateOrganizationGuard implements CanLoad {
  constructor(
    private router: Router,
    private permissions: PermissionsService
  ) { }

  canLoad(): boolean {
    if (this.permissions.isauthenticated() && (this.permissions.isOrganizationStaff() || this.permissions.isTeacher())) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
