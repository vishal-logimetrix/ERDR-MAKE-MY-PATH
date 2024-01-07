import {Component, OnDestroy, OnInit, ElementRef, ViewChild, TemplateRef, ViewEncapsulation} from '@angular/core';

import {environment} from '../../../../../../../environments/environment';

import {AuthService} from '../../../../../../services/auth.service';
import {CartService} from '../../../../../../services/cart.service';
import {MiscellaneousService} from '../../../../../../services/miscellaneous.service';
import {NetworkRequestService} from '../../../../../../services/network-request.service';
import {UtilsService} from '../../../../../../core/services/utils.service';
import {Observable, Subscription} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseSwitchService } from 'src/app/modules/assessment/services/course-switch.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, catchError } from 'rxjs/operators';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { ToastrService } from 'ngx-toastr';
import { BootstrapService } from 'src/app/services/bootstrap.service';
import { LoginService } from 'src/app/core/services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss']
})
export class DashboardNavComponent implements OnInit, OnDestroy {

  @ViewChild('otpModal', {static: true}) otpModalRef: TemplateRef<any>;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private utils: UtilsService,
    private misc: MiscellaneousService,
    private networkRequest: NetworkRequestService,
    private route: ActivatedRoute,
    private bt: BootstrapService,
    private router: Router,
    private courseswitchservice: CourseSwitchService,
    private permissions: PermissionsService,
    private toastr: ToastrService,
    private loginservice: LoginService,
    private cookie: CookieService,
    private http: HttpClient
  ) {
    this.cartSubscription = this.cart.CartChange.subscribe(
      cartItems => {
        this.cartItemCount = cartItems.length;
      }
    );
  }
  @ViewChild('closeModals') closeModals: ElementRef;

  env = environment;
  userProfile;
  showsidebar = false;
  isMobile = false;

  cartItemCount = 0;

  
  cartSubscription: Subscription;

  notificationCount = {};
  notificationList: object;
  max_page: number;
  pages = [];
  currentPage = 0;
  searchTerm;
  islocation: boolean = false;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchIcon;
  errors = null;
  viewDetailbutton = false;
  tag;
  TagData;
  clickedItem;
  isAuthenticated = this.permissions.isauthenticated();

  
  isTablet = this.utils.isTablet();
  // isMobile = this.utils.isMobile();

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
  activeLogin: string = "otp";
  activeGoal: boolean = false;
  activeAssociation: boolean = false;
  activeFaq: boolean = false;
  activeAbout: boolean = false;
  passwordLogin;
  password;


  showPasswordForm() {
    this.passwordLogin = true;
    this.activeLogin = 'password';
  }

  hidePasswordForm() {
    this.passwordLogin = false;
    this.activeLogin = 'otp';
  }
  
  feedback = {
    errors: '',
    message: ''
  };

  showLoader = {
    visibility: false,
  };
  BASE_URL = environment.BASE_URL;

  selectedItem(item){
    this.clickedItem=item.item;
    // console.log("clickedItem", this.clickedItem, this.options);
    for (let i = 0; i < this.TagData.length; i++) {
      if (this.TagData[i]['title'] == this.clickedItem) {
        this.router.navigate([`/assessment/dashboard/choose-p/${this.TagData[i]['id']}`]);
        this.closeModals.nativeElement.click();
      }
    }
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap( (searchText) =>  this.examLookup(searchText) ),
    
    // catchError(new ErrorInfo().parseObservableResponseError) 
    // map(text => text.length < 1 ? []
    //   : this.options.length>0 ? this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10) : ['No Exam Found'])
  )

  examLookup(text) {
    this.options = [];
    this.TagData = null;
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get(`${this.BASE_URL}/api/searchexamnav/?text=${text}`, httpOptions)
    .pipe(map(res => {
      this.TagData = res;
      console.log("response", res);
      // @ts-ignore
      res.map((item) => {
        this.options.push(item['title']);
      });
      return this.options;
    }));
  }

  detectTag(obj: any) {
    this.searchIcon = false;
    let array1 = [];
    // const objdata = {
    //   text: obj.target.value,
    // }
  
    let text = obj.target.value
  
    this.networkRequest.getWithHeaders(`/api/searchexamnav/?text=${text}`).subscribe(
      data => {
        console.log("exams ", data);
        this.searchIcon = false;
        // @ts-ignore
        data.map((item) => {
          array1.push(item['title']);
          this.options.push(item['title']);
        });
        // this.search;
        setTimeout(() => {
          // this.options = array1;
          this.search;
        }, 200);
        // if (this.options.length == 0) {
        //   this.options = ['No Exam Found'];
        // }
        console.log("options", this.options);
        // @ts-ignore
        this.TagData = data;
      },
      error => {
        //"Error section")
        this.errors = error['message'];
        //"error msg", this.errors);
        this.viewDetailbutton = false;
        this.searchIcon = true;
      }
    )
    if (this.options.length == 0 || obj.target.value.length < 2){
      document.getElementById("typeahead-basic").classList.remove("input-field-radius");
      this.viewDetailbutton = false;
      this.searchIcon = true;
    }
    else {
      document.getElementById("typeahead-basic").classList.add("input-field-radius");
      this.viewDetailbutton = true;
      this.searchIcon = false;
    }
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  // TagFilter() {
  //   let filtered = [];
  //   for (let i = 0; i < this.TagData.length; i++) {
  //     if (this.TagData[i].title == this.tag) {
  //       console.log("tagaaaa", this.TagData[i], this.tag)
  //       filtered.push(this.TagData[i]);
  //     }
  //   }
  
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  searchExam() {
    var url = this.router.url.split("?", 1);
    this.router.navigate([url[0]],{
      queryParams: {
        s: this.searchTerm
      }
    });
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }

  getNotificationsCount() {
    this.networkRequest.getWithHeaders('/api/notifications_count/').subscribe(data => {
      this.notificationCount['count'] = data['notification_count'];
    });
  }

  getNotificationsList(statustype: any, page: any) {
    this.networkRequest.getWithHeaders(`/api/notifications_list/${statustype}/?page=${page}`).subscribe(
      (data:object) => {
        this.notificationList = data;
        if (data['count'] % data['page_size'] === 0) {
          this.max_page = Math.floor(data['count'] / data['page_size']);
        } else {
          this.max_page = Math.floor(data['count'] / data['page_size']) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
    });
  }

  toggleSidebar() {
    this.showsidebar = !this.showsidebar;
    // console.log("showsidebar", this.showsidebar);
    this.misc.showMobileSidebar.next(true);
  }


  logout() {
    this.auth.logout();
  }
  loginUsingPassword() {
    this.loaderActive = true;
    const username = this.phoneNumber;
    const password = this.password;

    if (username && password) {
      const user = {
        user: {
          email: username,
          password: password
        }
      };

      this.auth.login(JSON.stringify(user), '/api/users/login/')
        .subscribe(
          user => {
            console.log("user", user);
            if (user['user']) {
              this.loaderActive = false;
              console.log("success login");
              this.toastr.success('Logged in successfully!', 'Loading..!', {
                timeOut: 4000,
              });
              this.bt.hideModal();
              this.closeModal.nativeElement.click();
              this.loginservice.processLogin(user).subscribe(() => {
                this.misc.showLoader();
              });
            } else {
              this.errors = ['Account Does Not Exist'];
              this.toastr.error(this.errors, 'Error!', {
                timeOut: 5000,
              });
            }
          },
          error => {
            // console.log("errorsection", error);
            this.loaderActive = false;
            this.errors = error['message'];
            this.toastr.error(this.errors, 'Error!', {
              timeOut: 5000,
            });
          });
    }
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
          // this.toastr.error("User not registered", 'Error!', {
          //   timeOut: 4000,
          // });
          this.name = null;
          this.showLogin = false;
          this.validLoginNo = false;
          setTimeout(() => {
            this.registrationPhoneNumber = this.phoneNumber;
            this.validateSignUpNumber();
          }, 100);
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
    this.showOtpRegister = false;
  }

  showLoginForm() {
    this.phoneNumber = null;
    this.showLogin = true;
    this.showOtp = false;
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

  clearValidations() {
    this.feedback.errors = '';
    this.feedback.message = '';
  }




  ngOnInit() {
    this.courseswitchservice.examPageStatus.subscribe(
      data => {
        if (data) {
          this.islocation = true;
        }
        else {
          this.islocation = false;
        }
    });
    this.isMobile = this.utils.isMobile();

    this.misc.showMobileSidebar.subscribe(
      data => {
        this.showsidebar = data;
      }
    );

    // this.cart.getCart().subscribe();
    // this.getNotificationsCount();
    // this.getNotificationsList('unread', 1);
    // if (this.searchTerm) {
    //   this.searchExam();
    // }
    this.getUserProfile();
    this.misc.userProfileChange.subscribe(
      data => {
        this.getUserProfile();
      }
    );
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
