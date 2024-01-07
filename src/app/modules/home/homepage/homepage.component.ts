import {Component,ElementRef,OnDestroy,OnInit,AfterViewInit,ViewChild,ViewEncapsulation,Input,TemplateRef,} from '@angular/core';
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
import { HomeSliderService } from '../../../services/home-slider.service';
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
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [HomeSliderService],
  animations: [trigger('homeSlider', [
    state('in', style({
      opacity: 1,
    })),
    transition('void => *', [
      style({
        opacity: 0,
      }),
      animate(1000)
    ]),
  ])]
})
export class HomepageComponent implements OnInit, OnDestroy, AfterViewInit  {

  @ViewChild('otpModal', {static: true}) otpModalRef: TemplateRef<any>;
  @ViewChild('closeModal') closeModal: ElementRef;
  

  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private networkRequest: NetworkRequestService,
    private bt: BootstrapService,
    private utils: UtilsService,
    private misc: MiscellaneousService,
    private alertService: AlertService,
    private homeSlider: HomeSliderService,
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
  ) {
  }

  @Input() sliderText: string;
  @ViewChild('feature', { static: false }) featureRef: ElementRef<any>;
  @ViewChild('container') container: ElementRef<HTMLElement>;
  @ViewChild('association') association: ElementRef;
  @ViewChild('exams') exams: ElementRef;
  @ViewChild('faq') faq: ElementRef;

  env = environment;
  phonenumber: any;
  isAuthenticated = this.permissions.isauthenticated();
  modalRef: BsModalRef;
  modalData: any;
  examCategories;
  kdomains;
  entrancedomains;
  jobdomains;
  activateGoTop : boolean;

 

  onClickScroll(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  @HostListener('window:scroll',[])
    onWindowScroll() {
         if ( window.scrollY > 500 ) {
            this.activateGoTop = true;
         } else {
            this.activateGoTop = false;
         }
     }
  
  feedback = {
    errors: '',
    message: ''
  };

  showLoader = {
    visibility: false,
  };

  isTablet = this.utils.isTablet();
  isMobile = this.utils.isMobile();

  showLogin: boolean = true;
  showOtp: boolean = false;
  showOtpRegister: boolean = false;

  scrollSubcription: Subscription;
  sliderSubscription: Subscription;
  loaderActive = false;
  phoneNumber;
  otp;
  registrationPhoneNumber;
  registrationOTP;
  name;
  errors;
  registrationData;
  signupAsStudent: boolean = true;
  timer: number = 30;
  timervar;
  phonepattern = /^[6-9]\d{9}$/;
  otppattern = /^[0-9]\d{6}$/;
  namepattern = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
  validLoginNo: boolean = false;
  validLoginOtp: boolean = false;
  validName: boolean = false;
  activeCard:string = "student";

  goDown1() {
    this.scroller.scrollToAnchor("exams");
  }
  goDown2() {
    this.scroller.scrollToAnchor("institute");
  }
  goDown3() {
    this.scroller.scrollToAnchor("about");
  }
  ngAfterViewInit() {

    // Handle Bootstrap Modals
    this.bt.modalState.subscribe(state => {
      try {
        this.modalRef.hide();
      } catch (e) {
      }
      if (state['state']) {
        if (state['modal'] === 'otp') {
          this.modalRef = this.modalService.show(this.otpModalRef, this.bt.config);
        }
      }

      this.modalData = state['data'];
    });

    this.activeRoute.queryParams.subscribe(param => {
      if(param.pageSec){
        // const section = this.container.nativeElement.querySelector(`#${param.pageSec}`)
        // console.log("section", section);

        if (param.pageSec=='exams') {
          setTimeout(() => {
            this.goDown1();
          }, 500);
        }
        else if (param.pageSec=='institute') {
          setTimeout(() => {
            this.goDown2();
          }, 500);
        }
        else if (param.pageSec=='faqDiv') {
          setTimeout(() => {
            this.onClickScroll('faqDiv');
          }, 500);
        }
      }
    })
  }

  validateLoginNumber() {
    if (!this.phoneNumber.match(this.phonepattern)) {
      this.validLoginNo = false;
    }
    else {
      this.validLoginNo = true;
    }
  }

  validateSignUpName() {
    if (!this.name.match(this.namepattern)) {
      this.validName = false;
    }
    else {
      this.validName = true;
    }
  }

  validateSignUpNumber() {
    if (!this.registrationPhoneNumber.match(this.phonepattern)) {
      this.validLoginNo = false;
    }
    else {
      this.validLoginNo = true;
    }
  }

  sendOTP() {
    var checkData;
    this.networkRequest.getWithoutHeaders(`/api/searchuserbynumber/?phonenumber=${this.phoneNumber}`).subscribe(
      data => {
        console.log("searched user ", data);
        checkData = data;
        if (checkData.length == 0) {
          this.toastr.error("User not registered", 'Error!', {
            timeOut: 4000,
          });
          return;
        }
        else {
          this.timer = 30;
          this.showOtp = true;
          if (this.timer > 0) {
            this.timervar = setInterval(() => {
              this.timer -= 1;
              if (this.timer <= 0) {
                clearInterval(this.timervar);
              }
            }, 1000);
          }
          this.misc.sendOtp(this.phoneNumber).subscribe();
        }
      },
      error => {
        console.log("error ", error);
      }
    )
    
  }

  sendOTPRegister() {
    this.showOtpRegister = true;
    this.timer = 30;
    this.showOtp = true;
    if (this.timer > 0) {
      this.timervar = setInterval(() => {
        this.timer -= 1;
        if (this.timer <= 0) {
          clearInterval(this.timervar);
        }
      }, 1000);
    }
    this.misc.sendOtp(this.registrationPhoneNumber).subscribe();
  }

  openRegister() {
    this.registrationPhoneNumber = null;
    this.name = null;
    this.showLogin = false;
    this.validLoginNo = false;
  }

  showLoginForm() {
    this.phoneNumber = null;
    this.showLogin = true;
    this.showOtp = false;
  }
  openRegisterStudent() {
    this.registrationPhoneNumber = null;
    this.name = null;
    this.showLogin = false;
    this.validLoginNo = false;
    this.signUpStudent() ;
  }
  openRegisterMentor() {
    this.registrationPhoneNumber = null;
    this.name = null;
    this.showLogin = false;
    this.validLoginNo = false;
    this.signUpTeacher() ;
  }

  signUpTeacher() {
    this.signupAsStudent = false;
    this.activeCard = 'teacher';
  }

  signUpStudent() {
    this.signupAsStudent = true;
    this.activeCard = 'student';
  }

  register() {

    const fullname = this.name;
    const phone = this.registrationPhoneNumber;

    const user = {
      user: {
        phonenumber: phone,
        fullname: fullname
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
            this.misc.sendOtp(phone).subscribe();
            if (!this.signupAsStudent) {
              const userData = {
                user_group: 'teacher'
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
            }
            this.sendOTPRegister();
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

  verifyLoginOtp() {

    /***
     * Verify Otp
     */

    // this.misc.showLoader('short');
    this.misc.verifyOtp(this.otp, this.phoneNumber).subscribe(
      data => {

        if (data) {
          this.bt.hideModal();
          // const email = this.registrationData['user']['username'];
          // const password = this.registrationData['user']['username'];

          if (this.phoneNumber && this.otp) {

            const user = {
              user: {
                email: this.phoneNumber,
                password: this.otp
              }
            };

            this.loaderActive = true;
            this.auth.login(JSON.stringify(user), '/api/users/otplogin/')
              .subscribe(
                user => {
                  console.log("user", user);
                  this.loaderActive = false;
                  this.closeModal.nativeElement.click();

                  if (user['user']) {
                    this.loginservice.processLogin(user).subscribe(() => {
                      this.misc.showLoader();
                    });
                  } else {
                    this.errors = ['Account Does Not Exist'];
                  }
                },

                error => {
                  this.loaderActive = false;
                  this.errors = error['message'];
                  this.cookie.delete('_l_a_t');
                });
          }
          // this.loginservice.processLogin(this.registrationData).subscribe(() => {
          //   this.misc.showLoader();
          // });
        }
      },
      error => {
        this.errors = error;
        this.misc.showLoader()
      }
    );
  }

  verifyOtp(otp) {

    /***
     * Verify Otp
     */

    // this.misc.showLoader('short');
    this.misc.verifyOtp(otp, this.registrationPhoneNumber).subscribe(
      data => {

        if (data) {
          this.bt.hideModal();
          const email = this.registrationData['user']['username'];
          const password = this.registrationData['user']['username'];

          if (email && password) {

            const user = {
              user: {
                email: this.registrationPhoneNumber,
                password: this.registrationOTP
              }
            };

            this.loaderActive = true;
            this.auth.login(JSON.stringify(user), '/api/users/otplogin/')
              .subscribe(
                user => {
                  console.log("user", user);
                  this.loaderActive = false;
                  this.closeModal.nativeElement.click();

                  if (user['user']) {
                    this.loginservice.processLogin(user).subscribe(() => {
                      this.misc.showLoader();
                    });
                  } else {
                    this.errors = ['Account Does Not Exist'];
                  }
                },

                error => {
                  this.loaderActive = false;
                  this.errors = error['message'];
                  this.cookie.delete('_l_a_t');
                });
          }
          // this.loginservice.processLogin(this.registrationData).subscribe(() => {
          //   this.misc.showLoader();
          // });
        }
      },
      error => {
        this.errors = error;
        this.misc.showLoader()
      }
    );
  }

  login() {
    const email = this.phoneNumber;
    const password = this.otp;

    if (email && password) {

      const user = {
        user: {
          email: email,
          password: password
        }
      };

      this.loaderActive = true;
      this.auth.login(JSON.stringify(user), '/api/users/login/')
        .subscribe(
          user => {

            this.loaderActive = false;
            this.closeModal.nativeElement.click();
            if (user['user']) {

              // Open Otp Modal (if phone not verified)
              if (user['user'].phonestatus === 'False') {

                // Hide modal
                this.bt.hideModal();
                this.bt.openModal('otp', user);
              } else {

                // Hide modal
                this.bt.hideModal();

                // Process login
                this.misc.showLoader('short');
                this.loginservice.processLogin(user).subscribe();
              }
            } else {
              this.errors = ['Account Does Not Exist'];
            }
          },

          error => {
            this.loaderActive = false;
            this.errors = error['message'];
            this.cookie.delete('_l_a_t');
          });
    }
  }

  sendAppLink() {
    this.phonenumber = this.validatePhone(this.phonenumber);

    this.alertService.showAlert({ text: 'You\'ll recieve a download link on your phone soon' }, 'success').subscribe();

    this.networkRequest.postWithHeader(JSON.stringify({ number: this.phonenumber }), '/api/send_applink/')
      .subscribe(data => {
        if (data['number']) {
          this.phonenumber = '';
        }
      });
  }


  validatePhone(phone) {

    this.feedback.errors = '';
    if (!phone) {
      this.feedback.errors = 'Phone number is required';
      return;
    }
    if (this.env.PHONE_REGEX.test(phone)) {
      return phone;
    } else {
      this.feedback.errors = 'Enter valid phone number';
    }
  }


  startNow() {
    if (this.permissions.isauthenticated()) {
      this.router.navigateByUrl('/assessment/dashboard');
    } else {
      this.bt.openModal('login');
    }
  }


  clearValidations() {
    this.feedback.errors = '';
    this.feedback.message = '';
  }


  startSlider() {
    this.sliderSubscription = this.homeSlider.initializeSlider()
      .subscribe((data: string) => {
        this.sliderText = data;
      });
  }

  selectCourse(id) {
    this.courseswitchservice.updateCourseId(id);
    this.courseswitchservice.updateExamId('');
  }

  getCategories() {
    this.networkRequest.getWithHeaders('/api/examcategory/')
      .subscribe(
        data => {
          console.log("categories ", data);
          // Populate Selected Assessment list with server data
          this.examCategories = data;
          for (let i = 0; i < this.examCategories.length; i++) {
            if (this.examCategories[i]['title'] == 'K-12') {
              this.networkRequest.getWithHeaders(`/api/domain/?category_id=${this.examCategories[i]['id']}`)
              .subscribe(
                data => {
                  console.log("k-12 domains ", data);
                  // Populate Selected Assessment list with server data
                  this.kdomains = data;
                },
                error => {
                  console.log("error ", error);
                }
              );
            }
            else if (this.examCategories[i]['title'] == 'Entrance') {
              this.networkRequest.getWithHeaders(`/api/domain/?category_id=${this.examCategories[i]['id']}`)
              .subscribe(
                data => {
                  console.log("entrance domains ", data);
                  // Populate Selected Assessment list with server data
                  this.entrancedomains = data;
                },
                error => {
                  console.log("error ", error);
                }
              );
            }
            else if (this.examCategories[i]['title'] == 'Job') {
              this.networkRequest.getWithHeaders(`/api/domain/?category_id=${this.examCategories[i]['id']}`)
              .subscribe(
                data => {
                  console.log("job domains ", data);
                  // Populate Selected Assessment list with server data
                  this.jobdomains = data;
                },
                error => {
                  console.log("error ", error);
                }
              );
            }
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }


  ngOnInit() {
    this.startSlider();
    this.getCategories();

    this.activateGoTop = false;
   
  }


  ngOnDestroy() {
    // this.scrollSubcription.unsubscribe();
    this.sliderSubscription.unsubscribe();
  }


}
