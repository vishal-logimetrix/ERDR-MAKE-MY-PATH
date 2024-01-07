import {Component, OnInit, Input, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';

import {NetworkRequestService} from 'src/app/services/network-request.service';
import {BootstrapService} from 'src/app/services/bootstrap.service';
import {MiscellaneousService} from '../../../services/miscellaneous.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private modalService: BsModalService,
    private networkRequest: NetworkRequestService,
    private bt: BootstrapService,
    private misc: MiscellaneousService
  ) {
  }

  env = environment;

  @ViewChild('changePasswordModal', {static: true}) changePasswordModalRef: TemplateRef<any>;
  @Input('modalData') modalData: any;

  modalRef: BsModalRef;

  forgotPasswordSubmitted = false;
  changePasswordSubmitted = false;
  isOTPSent = false;

  // User Email Form
  forgotPasswordForm = this.form.group({
    email: ['', [Validators.required]],
  });

  // Change Password Form
  changePasswordForm = this.form.group({
    otp: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });


  errors = null;
  loaderActive = false;

  get f_p() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * Send Password Change Otp at email
   * Open Password reset popup
   */
  sendOTP() {

    this.forgotPasswordSubmitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const email = this.forgotPasswordForm.value.email;
    this.networkRequest.postWithHeader(JSON.stringify({email: email}), '/api/password_reset/').subscribe(
      data => {
        this.isOTPSent = true;
        this.bt.hideModal();
        this.modalRef = this.modalService.show(this.changePasswordModalRef);
      },
      error => {
        this.errors = error['error'].message || error['error']['errors']['email'];
      }
    );
  }


  get c_p() {
    return this.changePasswordForm.controls;
  }

  changePasswordSubmit() {

    /***
     * Reset Password
     * Open Login modal after password reset
     */

    this.changePasswordSubmitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    const otp = this.changePasswordForm.value.otp;
    const newPassword = this.changePasswordForm.value.password;

    this.loaderActive = true;
    this.networkRequest.postWithHeader(JSON.stringify({token: otp, password: newPassword}),
      '/api/password_reset/confirm/')
      .subscribe(
        data => {
          this.loaderActive = false;
          if (data['status'] === 'OK') {
            this.modalRef.hide();
            this.bt.openModal('login', {'message': 'Password reset successful, login to continue'});
          }
        },
        error => {
          this.loaderActive = false;
          this.errors = error['error']['errors'].password[0];
        });
  }

  onInput() {
    this.errors = null;
  }

  closeModal() {
    this.bt.hideModal();
  }

  ngOnInit() {
  }

}
