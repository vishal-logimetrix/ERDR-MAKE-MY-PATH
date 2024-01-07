import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NetworkRequestService} from 'src/app/services/network-request.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private networkRequest: NetworkRequestService
  ) {
  }

  submitted = false;

  changePassword = this.form.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  feedback = {
    errors: '',
    message: ''
  };


  get f() {
    return this.changePassword.controls;
  }

  onSubmit() {

    this.submitted = true;

    if (this.changePassword.invalid) {
      return;
    }

    if (this.changePassword.value['newPassword'] === this.changePassword.value['confirmPassword']) {
      const passwordObj = {
        old_password: this.changePassword.value['oldPassword'],
        new_password: this.changePassword.value['newPassword'],
        confirm_password: this.changePassword.value['confirmPassword'],
      };

      this.networkRequest.postWithHeader(JSON.stringify(passwordObj), '/api/password_reset/reset_password/').subscribe(
        data => {
          if (data['status'] === 'OK') {
            this.feedback.errors = null;
            this.feedback.message = 'Password Changed Successfully';
            this.submitted = false;
            this.changePassword.reset();
          }
        },
        error => {
          if (error['error']['errors']) {
            this.feedback.errors = error['error']['errors']['old_password'];
          }
        }
      );
    } else {
      this.feedback.errors = 'Password did not match';
    }
  }


  onPasswordInput() {
    this.feedback.errors = null;
  }


  ngOnInit() {
  }

}
