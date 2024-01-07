import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { PermissionsService } from '../core/services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateInstituteGuard implements CanLoad {
  constructor(
    private router: Router,
    private permissions: PermissionsService
  ) { }

  canLoad(): boolean {
    if (this.permissions.isauthenticated() && (this.permissions.isInstituteStaff() || this.permissions.isMMPAdmin() || this.permissions.isContentManager())) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
