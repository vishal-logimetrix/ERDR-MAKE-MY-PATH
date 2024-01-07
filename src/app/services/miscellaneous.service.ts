import { Injectable } from '@angular/core';
import { throwError, Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NetworkRequestService } from './network-request.service';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})

export class MiscellaneousService {

  constructor(
    private router: Router,
    private cookie: CookieService,
    private locationStrategy: LocationStrategy,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) {
  }

  showMobileSidebar: Subject<boolean> = new Subject<boolean>();

  userProfileData: Subject<object> = new Subject<object>();
  userProfileChange: Subject<boolean> = new Subject<boolean>();

  // Handle Loader
  showLoaderSubject: Subject<object> = new Subject<object>();
  scrollToView: Subject<string> = new Subject<string>();
  showMenuSubject: Subject<string> = new Subject<string>()

  handleError(error: HttpErrorResponse) {

    let errorMessage: any;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error['errors'].error}`);
    }
    // return an observable with a user-facing error message
    if (error.error['errors'].error) {
      errorMessage = error.error['errors'].error;
    } else {
      errorMessage = error.error['errors'];
    }
    return throwError({
      status: error.status,
      message: errorMessage
    });
  };

  sendOtp(phonenumber) {

    /***
     * Send Otp
     * Post Data: phone_number
     */


    return new Observable(observer => {
      this.showLoader('short');
      this.networkRequest.postWithHeader(JSON.stringify({ phone_number: phonenumber }), '/api/send_otp/')
        .subscribe(
          data => {
            console.log("otp sent", data);
            observer.next(data);
            this.hideLoader();
          },
          error => {
            observer.error(error);
            this.hideLoader();
          }
        );
    });
  }


  verifyOtp(otp, phonenumber) {

    /***
     * Verify Otp
     * Post Data: phone_number, otp
     * Process Login after phone verification
     */

    return new Observable(observer => {

      this.showLoader('short');

      const verificationData = JSON.stringify({ otp: otp, phone_number: phonenumber });
      this.networkRequest.postWithHeader(verificationData, '/api/verify_otp/')
        .subscribe(
          data => {
            observer.next(data['phone_number']);
            this.hideLoader();
          },
          error => {
            observer.error(error['error'].reason);
            this.toastr.error(error['error'].reason, 'Error!', {
              timeOut: 4000,
            });
            this.hideLoader();
          }
        );
    });
  }


  formatAssessment(packages, categories) {
    const assessmentList = [];
    categories.forEach(category => {

      const packageList = packages.filter(pkg => {
        return pkg['course_details'].id === category.id;
      });

      if (packageList.length !== 0) {
        assessmentList.push({
          assessment: category,
          packages: packageList
        });
      }
    });

    return assessmentList;
  }


  userProfile() {
    return new Observable(observer => {
      this.networkRequest.getWithHeaders('/api/profile/').subscribe(
        data => {
          this.userProfileData.next(data['profile']);
          observer.next(data['profile']);
        }
      );
    });
  }

  /**
   * Intialize mathjax configurations
   */
  initializeMathJax(mathjax: any) {
    return new Observable(obserser => {
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, mathjax])');
      obserser.next();
    });
  }


  showLoader(type = 'full') {
    this.showLoaderSubject.next({ visibility: true, type: type });
  }

  hideLoader() {
    this.showLoaderSubject.next({ visibility: false });
  }
}
