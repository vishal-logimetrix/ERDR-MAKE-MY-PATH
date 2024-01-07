import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MiscellaneousService} from 'src/app/services/miscellaneous.service';
import {BootstrapService} from 'src/app/services/bootstrap.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private form: FormBuilder,
    private auth: AuthService,
    private misc: MiscellaneousService,
    private bt: BootstrapService
  ) {
  }

  env = environment;

  submitted = false;

  registerForm = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(this.env.PHONE_REGEX)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  errors = null;

  get f() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const phone = this.registerForm.value.phone;

    const user = {
      user: {
        email: email,
        password: password,
        phonenumber: phone
      }
    };

    if (email && phone && password) {
      this.misc.showLoader('short')
      this.auth.register(JSON.stringify(user), '/api/users/register/').subscribe(
        user => {
          if (user['user']) {
            this.bt.hideModal();
            this.misc.hideLoader()
            this.bt.openModal('otp', user);
          }
        },
        error => {
          this.misc.hideLoader()
          const emailError = error.message['email'];
          const phoneError = error.message['phonenumber'];

          this.errors = emailError ? emailError[0] : (phoneError ? phoneError[0] : '');
        }
      );
    }
  }

  onRegisterInput() {
    this.errors = null;
  }

  openLogin() {
    this.bt.openModal('login');
  }

  closeModal() {
    this.bt.hideModal();
  }

  ngOnInit() {
  }

}
