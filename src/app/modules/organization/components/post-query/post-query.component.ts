import {Component, OnInit} from '@angular/core';
import {NetworkRequestService} from 'src/app/services/network-request.service';
import {FormBuilder, Validators} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {MiscellaneousService} from '../../../../services/miscellaneous.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-query',
  templateUrl: './post-query.component.html',
  styleUrls: ['./post-query.component.scss']
})
export class PostQueryComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private form: FormBuilder,
    private misc: MiscellaneousService,
    private route: ActivatedRoute
  ) {
  }

  env = environment;

  submitted = false;
  examId;
  examDetails;
  userProfile;

  contactUsForm = this.form.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phonenumber: ['', [Validators.required, Validators.pattern(this.env.PHONE_REGEX)]],
    message: ['', [Validators.required]],
  });

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

    var contactUsObj;
    if (this.examId) {
      contactUsObj = {
        name: this.contactUsForm.value.username,
        email: this.contactUsForm.value.email,
        contact: this.contactUsForm.value.phonenumber,
        query: this.contactUsForm.value.message,
        exam: this.examId
      };  
    }
    else {
      contactUsObj = {
        name: this.contactUsForm.value.username,
        email: this.contactUsForm.value.email,
        contact: this.contactUsForm.value.phonenumber,
        query: this.contactUsForm.value.message,
      };  
    }
    
    this.misc.showLoader('short');
    if (contactUsObj.name && contactUsObj.contact && contactUsObj.query) {
      this.networkRequest.postWithHeader(JSON.stringify(contactUsObj),'/api/create_query/')
        .subscribe(
          data => {
            if (data) {
              this.feedback.errors = null;
              this.feedback.message = 'Thank you for contacting us – we will get back to you soon!';
              this.submitted = false;
              // this.contactUsForm.reset();
              this.contactUsForm.controls['message'].reset();
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

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
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

  ngOnInit() {
    this.getUserProfile();
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.exam;
        if (this.examId) {
          this.getExamDetails();
        }
    });
  }

}
