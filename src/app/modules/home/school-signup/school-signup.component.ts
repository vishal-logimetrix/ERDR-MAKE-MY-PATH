import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  TemplateRef,
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { BootstrapService } from 'src/app/services/bootstrap.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { PermissionsService } from '../../../core/services/permissions.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { UtilsService } from '../../../core/services/utils.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { LoginService } from 'src/app/core/services/login.service';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ViewportScroller } from '@angular/common';
import { CourseSwitchService } from '../../assessment/services/course-switch.service';
import { HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-school-signup',
  templateUrl: './school-signup.component.html',
  styleUrls: ['./school-signup.component.scss']
})
export class SchoolSignupComponent implements OnInit {

  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private networkRequest: NetworkRequestService,
    private bt: BootstrapService,
    private utils: UtilsService,
    private misc: MiscellaneousService,
    private alertService: AlertService,
    private loginservice: LoginService,
    private auth: AuthService,
    private cookie: CookieService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private scroller: ViewportScroller,
    private courseswitchservice: CourseSwitchService,
    private viewportScroller: ViewportScroller,
    private http: HttpClient, 
    private activeRoute: ActivatedRoute
  ) { }

  feedback = {
    errors: '',
    message: ''
  };

  showLoader = {
    visibility: false,
  };

  showLogin: boolean = true;
  showOtp: boolean = false;
  showOtpRegister: boolean = false;
  phoneNumber;
  password;
  otp;
  registrationPhoneNumber;
  registrationOTP;
  name;
  errors;
  registrationData;
  phonepattern = /^[6-9]\d{9}$/;
  otppattern = /^[0-9]\d{6}$/;
  namepattern = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
  schoolName;
  street;
  pin;
  state;
  city;
  states;
  cities;
  email;
  website;
  schoolId;

  fetchStateCities(stateId) {
    this.cities = null;
    this.networkRequest.getWithHeaders(`/api/citiesList/?state=${stateId}`)
      .subscribe(
        data => {
          console.log("cities ", data);
          this.cities = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getStates() {
    this.networkRequest.getWithHeaders('/api/statesList/')
      .subscribe(
        data => {
          console.log("states ", data);
          // Populate Selected Assessment list with server data
          this.states = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  registerSchool() {
    const formData = {
      name: this.schoolName,
      email: this.email,
      website: this.website,
      head: this.name,
      head_contact_no: this.registrationPhoneNumber,
      city: this.city,
      street: this.street,
      is_verified: false,
      // school_code: this.code,
      pin: this.pin,
      registered: true
    }

    this.networkRequest.postFormData(formData, '/api/createinstitute/').subscribe(
      data => {
        console.log("school successfully created ", data);
        this.toastr.success('School created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.schoolId = data['institute']['id'];
        this.register();
        // this.router.navigate(["/institute"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  register() {

    const fullname = this.name;
    const phone = this.registrationPhoneNumber;

    const user = {
      user: {
        phonenumber: phone,
        fullname: fullname,
        password: this.password
      }
    };

    if (fullname && phone) {
      this.misc.showLoader('short')
      this.auth.register(JSON.stringify(user), '/api/users/register/').subscribe(
        user => {
          console.log("user", user);
          if (user['user']) {
            this.misc.hideLoader();
            // this.bt.openModal('otp', user); 
            this.registrationData = user;
            const userData = {
              user_group: 'principal'
            }
            const decoded_token = this.utils.decodeToken(user['user']['token']);
            console.log("decoded_token ", decoded_token);
            const user_id = decoded_token['id'];
            this.networkRequest.putWithoutHeaders(userData, `/api/profile/usergroup/${user_id}/`)
            .subscribe(
              data => {
                console.log("role updated ", data);
              },
              error => {
              });
              const schoolData = {
                institute: this.schoolId
              }
              this.networkRequest.putWithoutHeaders(schoolData, `/api/profile/userschoolandverify/${user_id}/`)
            .subscribe(
              data => {
                console.log("school updated ", data);
              },
              error => {
              });
              this.router.navigate(["/"]);
          }
        },
        error => {
          this.misc.hideLoader()
          const emailError = error.message['email'];
          const phoneError = error.message['phonenumber'];

          this.errors = emailError ? emailError[0] : (phoneError ? phoneError[0] : '');
          this.toastr.error(this.errors, 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }


  ngOnInit(): void {
    this.getStates();
  }

}
