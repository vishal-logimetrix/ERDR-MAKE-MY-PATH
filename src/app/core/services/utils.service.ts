import {Injectable} from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {MediaMatcher} from '@angular/cdk/layout';

import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private cookie: CookieService,
    private mediaMatcher: MediaMatcher,
  ) {
  }

  decodeToken(token) {

    /**
     * Decode Token
     */

    let decoded: any;
    if (token) {
      try {
        decoded = jwt_decode(token);
      } catch (e) {
        decoded = null;
      }
    }

    return decoded;
  }


  getTokenExpirationDate(token: string): Date {

    /**
     * Return Token Expiry Date
     */

    const decoded_token = this.decodeToken(token);
    let date: any;

    if (decoded_token) {
      if (decoded_token.exp === undefined) {
        return null;
      }
      date = new Date(0);
      date.setUTCSeconds(decoded_token.exp);
    } else {
      return null;
    }

    return date;
  }


  /**
   * [setCookieData]
   * @param {object}  {values to save in cookie}
   */
  setCookieData(data = {}) {

    for (const keyname in data) {

      if (environment.production) {
        this.cookie.set(`${keyname}`, data[keyname], environment.CART_EXPIREY_TIME, '/');
      } else {
        this.cookie.set(`${keyname}`, data[keyname], environment.CART_EXPIREY_TIME, '/');
      }
    }
  }


  isMobile() {

    // Is Mobile Device
    return this.mediaMatcher.matchMedia('(max-width: 768px)').matches;
  }

  isTablet() {

    // Is Mobile Device
    return this.mediaMatcher.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
  }
}
