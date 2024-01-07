import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionsService {

  constructor(
    private cookie: CookieService,
    private utils: UtilsService,
    private auth: AuthService
  ) {
  }


  isauthenticated(): boolean {
    const token = this.cookie.get('_l_a_t');
    if (!token) {
      return false;
    }

    const date = this.utils.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    if (date.valueOf() > new Date().valueOf()) {
      return true;
    } else {
      this.auth.logout();
      return false;
    }
  }

  isStaff() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    try {
      return decoded_token['is_staff'];
    } catch (e) {
      return false;
    }
  }

  isStudent() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'student') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  isTeacher() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'teacher') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  isMMPAdmin() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    // console.log("token", decoded_token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'admin') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  isContentManager() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    // console.log("token", decoded_token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'content_manager') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  isInstituteStaff() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'institutestaff') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  isOrganizationStaff() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    try {
      const user_group = decoded_token['user_group'];
      if (user_group == 'organizationstaff') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  /**
   * Check for incomplete profile
   */
  isProfileComplete() {
    return this.cookie.get('_ps') ? JSON.parse(this.cookie.get('_ps')) : true;
  }


  /**
   * @return true --> If profile is incomplete & user is enrolled
   * @return false --> If user is not enrolled
   */
  isProfileRequired() {
    const profileRequiredStatus = this.cookie.get('_pr') ? JSON.parse(this.cookie.get('_pr')) : false;
    if (profileRequiredStatus) {
      return true;
    } else {
      return false;
    }
  }


  isAssessmentelected() {

    // Is assessment selected status -> Default is false
    return localStorage.getItem('_cs') ? JSON.parse(localStorage.getItem('_cs')) : false;
  }
}
