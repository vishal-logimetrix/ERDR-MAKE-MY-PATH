import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NetworkRequestService} from '../../../services/network-request.service';
import {MiscellaneousService} from '../../../services/miscellaneous.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-contact-us-home',
  templateUrl: './contact-us-home.component.html',
  styleUrls: ['./contact-us-home.component.scss']
})
export class ContactUsHomeComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private form: FormBuilder,
    private misc: MiscellaneousService
  ) {
  }

  env = environment;

  contactUsForm = this.form.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phonenumber: ['', [Validators.required, Validators.pattern(this.env.PHONE_REGEX)]],
    message: ['', [Validators.required]],
  });

  submitted = false;

  feedback = {
    errors: '',
    message: ''
  };


  get f() {
    return this.contactUsForm.controls;
  }

  onSubmit() {

    this.submitted = true;

    if (this.contactUsForm.invalid) {
      return;
    }

    const contactUsObj = {
      username: this.contactUsForm.value.name,
      email: this.contactUsForm.value.email,
      phonenumber: this.contactUsForm.value.phonenumber,
      message: this.contactUsForm.value.message,
    };

    this.misc.showLoader('short');
    if (contactUsObj.username && contactUsObj.email && contactUsObj.phonenumber && contactUsObj.message) {
      this.networkRequest.postWithHeader(JSON.stringify(contactUsObj), null,
        'https://9knkac89s5.execute-api.us-east-1.amazonaws.com/dev/contact')
        .subscribe(
          data => {
            if (data) {
              this.feedback.errors = null;
              this.feedback.message = 'Thank you for contacting us – we will get back to you soon!';
              this.submitted = false;
              this.contactUsForm.reset();
              this.misc.hideLoader();
            }
          }, error => {
            this.misc.hideLoader();
          }
        );
    } else {
      this.feedback.message = null;
      this.feedback.errors = 'All fields are required';
    }
  }


  clearValidations() {
    this.feedback.errors = '';
    this.feedback.message = '';
  }

  ngOnInit() {
  }

}
