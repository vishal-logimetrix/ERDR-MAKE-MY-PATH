import {Component, OnInit, Input} from '@angular/core';

import {LoginService} from '../../core/services/login.service';
import {BootstrapService} from 'src/app/services/bootstrap.service';
import {MiscellaneousService} from '../../services/miscellaneous.service';
import {environment} from '../../../environments/environment.dev';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements OnInit {

  constructor(
    private login: LoginService,
    private bt: BootstrapService,
    private misc: MiscellaneousService
  ) {
  }

  env = environment;


  @Input('modalData') modalData: any;


  phone = {
    value: '',
    isValid: true,
    otpSent: false,
    verified: false
  };
  errors = null;

  onOtpInput(e) {

    this.errors = null;

    const otp = e.target.value;
    if (otp.length === 6) {
      this.verifyOtp(otp);
    }
  }


  checkPhoneStatus(phoneEl = null) {

    /***
     * Send Otp
     */

    this.phone.value = this.getPhoneNumber(phoneEl);

    if (this.env.PHONE_REGEX.test(this.phone.value)) {

      this.phone.isValid = true;
      this.phone.otpSent = true;

      this.misc.sendOtp(this.phone.value).subscribe();
    } else {
      this.phone.isValid = false;
    }
  }


  getPhoneNumber(phoneEl) {
    if (phoneEl) {
      return phoneEl.value;
    } else if (this.modalData.user.phonenumber) {
      return this.modalData.user.phonenumber;
    }
    return null;
  }


  verifyOtp(otp) {

    /***
     * Verify Otp
     */

    this.misc.showLoader('short')
    this.misc.verifyOtp(otp, this.phone.value).subscribe(
      data => {

        if (data) {
          this.bt.hideModal();
          this.login.processLogin(this.modalData).subscribe(() => {
            this.misc.showLoader()
          });
        }
      },
      error => {
        this.errors = error;
        this.misc.showLoader()
      }
    );
  }


  closeModal() {
    this.bt.hideModal();
  }

  ngOnInit() {
    this.checkPhoneStatus();
  }

}
