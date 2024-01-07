import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { MiscellaneousService } from '../../services/miscellaneous.service';
import { CookieService } from 'ngx-cookie-service';
import { NetworkRequestService } from '../../services/network-request.service';
import { PermissionsService } from './permissions.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from './utils.service';
import { InstituteOrganizationService } from 'src/app/services/institute-organization.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private router: Router,
    private cookie: CookieService,
    private auth: AuthService,
    private permissions: PermissionsService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private instituteOrganizationsvc: InstituteOrganizationService
  ) {
    this.loginRedirectUrl = sessionStorage.getItem('_lr')
      ? JSON.parse(sessionStorage.getItem('_lr'))
      : null;
  }

  loginRedirectUrl: any;
  userProfileObj;

  processLogin(user) {
    return new Observable((observer) => {
      // Set user token
      this.setToken(user['user']);
      console.log('user token--------',user['user']);
      // Delete old cart it (in case any other user logs in same browser)
      this.cookie.delete('cid');

      this.extraSteps().subscribe({
        error: (err) => {
          console.log('error in login', err);
          this.misc.hideLoader();
          this.auth.clearStorage();
          alert('Login failed!');
        },
        complete: () => {
          this.loginRedirect();
        },
      });
    });
  }

  extraSteps() {
    return new Observable((observer) => {
      this.networkRequest.getWithHeaders('/api/profile/').subscribe(
        (data) => {
          console.log('profile data received from server', data);
          this.userProfileObj = data['profile'];

          observer.complete();
        },
        (error) => {
          observer.error('failed');
        }
      );
    });
  }

  loginRedirect() {
    // If Staff user
    if (this.permissions.isStaff()) {
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/admin').then(() => {
          console.log('Login redirect page called', this.loginRedirectUrl);
          this.misc.hideLoader();
        });

        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    } else if (
      this.permissions.isStudent() &&
      this.userProfileObj['contact_verified']
    ) {
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/assessment/dashboard').then(() => {   //assessment-module/dashboard-module/  choosePComponent
          this.misc.hideLoader();                                        //url be like:  assessment/dashboard/choose-p/:exam
        });

        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    } else if (
      this.permissions.isStudent() &&
      !this.userProfileObj['contact_verified']
    ) {
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/').then(() => {
          this.misc.hideLoader();
        });

        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    } else if (this.permissions.isTeacher()) {
      // this.instituteOrganizationProfile();
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/organization').then(() => {
          this.misc.hideLoader();
        });

        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    } else if (
      this.permissions.isMMPAdmin() ||
      this.permissions.isContentManager()
    ) {
      // console.log("MMP Admin");
      // this.instituteOrganizationProfile();
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/institute').then(() => {
          this.misc.hideLoader();
        });

        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    }
    // else if (this.permissions.isInstituteStaff()) {
    //   this.instituteOrganizationProfile();
    //   // If Login redirect not defined
    //   if (!this.loginRedirectUrl) {
    //     this.router.navigateByUrl('/institute').then(() => {
    //       this.misc.hideLoader();
    //     });

    //     // If Login Redirect defined
    //   } else {
    //     this.postLoginRedirect();
    //   }
    // }
    else if (this.permissions.isOrganizationStaff()) {
      this.instituteOrganizationProfile();
      // If Login redirect not defined
      if (!this.loginRedirectUrl) {
        this.router.navigateByUrl('/organization').then(() => {
          this.misc.hideLoader();
        });
        // If Login Redirect defined
      } else {
        this.postLoginRedirect();
      }
    } else {
      this.auth.logout();
    }
  }

  instituteOrganizationProfile() {
    this.instituteOrganizationsvc
      .getInstituteOrganizationProfile()
      .subscribe((data) => {
        this.instituteOrganizationsvc.loadInstituteOrganizationProfileData(
          data
        );
      });
  }

  postLoginRedirect() {
    if (this.loginRedirectUrl) {
      this.router.navigateByUrl(this.loginRedirectUrl).then(() => {
        this.misc.hideLoader();
        sessionStorage.removeItem('_lr');
        location.reload();
      });
    }
  }

  setToken(user) {
    console.log('setToken method is called', user);
    try {
      this.cookie.set('_l_a_t', user.token, environment.LOGIN_EXPIRY_TIME, '/');
    } catch (err) {
      this.auth.logout();
    }
  }

  setLoginRedirect(path) {
    console.log('setLoginRedirect method called', path);
    sessionStorage.setItem('_lr', JSON.stringify(path));
  }
}
