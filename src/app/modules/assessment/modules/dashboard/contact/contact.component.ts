import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedback = {
    errors: '',
    message: ''
  };
  submitted = false;
  userProfile;

  env = environment;
  isAuthenticated = this.permissions.isauthenticated();

  contactUsForm = this.form.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phonenumber: ['', [Validators.required, Validators.pattern(this.env.PHONE_REGEX)]],
    message: ['', [Validators.required]],
  });

  get f() {
    return this.contactUsForm.controls;
  }

  constructor(
    private networkRequest: NetworkRequestService,
    private form: FormBuilder,
    private misc: MiscellaneousService,
    private route: ActivatedRoute,
    private permissions: PermissionsService
  ) { }

  onSubmit() {

    this.submitted = true;

    // if (this.contactUsForm.invalid) {
    //   return;
    // }

    var contactUsObj;
    contactUsObj = {
      name: this.contactUsForm.value.username,
      email: this.contactUsForm.value.email,
      contact: this.contactUsForm.value.phonenumber,
      query: this.contactUsForm.value.message,
    };
    this.misc.showLoader('short');
    if (contactUsObj.name && contactUsObj.contact && contactUsObj.query) {
      this.networkRequest.postWithHeader(JSON.stringify(contactUsObj),'/api/contact_us/')
        .subscribe(
          data => {
            if (data) {
              this.feedback.errors = null;
              this.feedback.message = 'Thank you for contacting us – we will get back to you soon!';
              this.submitted = false;
              // this.contactUsForm.reset();
              if (!this.isAuthenticated) {
                this.contactUsForm.reset();
              }
              else {
                this.contactUsForm.controls['message'].reset();
              }
              this.misc.hideLoader();
            }
          }, error => {
            this.misc.hideLoader();
          }
        );
    } else {
      this.misc.hideLoader();
      this.feedback.message = null;
      this.feedback.errors = 'Name, Contact and Message fields are required';
    }
  }


  clearValidations() {
    this.feedback.errors = '';
    this.feedback.message = '';
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
        console.log("userporilf", this.userProfile);
        this.contactUsForm.patchValue({
          username: this.userProfile['first_name'] + ' ' + this.userProfile['last_name'],
          email: this.userProfile['email'],
          phonenumber: this.userProfile['contactNumber']
        })
        // this.contactUsForm.get('username').disable();
        // this.contactUsForm.get('email').disable();
        // this.contactUsForm.get('phonenumber').disable();
      }
    );
  }


  ngOnInit(): void {
    if (this.isAuthenticated) {
      this.getUserProfile();
    }
  }

}
