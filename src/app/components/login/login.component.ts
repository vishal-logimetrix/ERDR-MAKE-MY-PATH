import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {AuthService} from '../../services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {BootstrapService} from 'src/app/services/bootstrap.service';
import {MiscellaneousService} from '../../services/miscellaneous.service';
import {NetworkRequestService} from '../../services/network-request.service';
import {LoginService} from '../../core/services/login.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private auth: AuthService,
    private cookie: CookieService,
    private bt: BootstrapService,
    private networkRequest: NetworkRequestService,
    private login: LoginService,
    private misc: MiscellaneousService
  ) {
  }

  env = environment;

  // Get Modal data (if passed any)
  @Input('modalData') modalData: any;

  //  Login Form
  loginForm = this.form.group({
    email: [''],
    password: [''],
  });

  errors = null;
  loaderActive = false;


  /**
   * Login User
   * Check Phone status, if phone not verified open otp popup
   * If Phone verified call processLogin() to set token and cart id
   */
  loginUser() {

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

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
                this.login.processLogin(user).subscribe();
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


  socialLogin(provider) {

    this.bt.hideModal();

    if (provider === 'google') {
      this.networkRequest.postWithHeader('', '/api/users/google1ststep/web/').subscribe(
        data => {
          this.login.setLoginRedirect('/assessment/dashboard');
          location.href = data['auth_uri'];
        }
      );
    } else if ('facebook') {
      this.networkRequest.postWithHeader('', '/api/users/facebook1ststep/web/').subscribe(
        data => {
          this.login.setLoginRedirect('/assessment/dashboard');
          location.href = data['auth_uri'];
        }
      );
    }
  }


  resetValidations() {

    // Clear Errors on login input
    this.errors = null;
  }


  openRegister() {
    this.bt.openModal('register');
  }


  openForgotPassword() {
    this.bt.openModal('forgotPassword');
  }


  closeModal() {
    this.bt.hideModal();
  }

  ngOnInit() {
  }

}
