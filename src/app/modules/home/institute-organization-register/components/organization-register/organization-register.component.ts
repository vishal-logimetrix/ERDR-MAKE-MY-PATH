import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { BootstrapService } from 'src/app/services/bootstrap.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { AlertService } from 'src/app/services/alert.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-register',
  templateUrl: './organization-register.component.html',
  styleUrls: ['./organization-register.component.scss']
})
export class OrganizationRegisterComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private misc: MiscellaneousService,
    private networkRequest: NetworkRequestService,
    private alert: AlertService,
    private errorHandler: ErrorHandlerService,
    private bt: BootstrapService,
  ) { }

  env = environment;
  
  InstituteForm: FormGroup;
  submitted = false;

  stateList: Array<object>;
  cityList: Array<object>;
  allowCityChange = false;
  country_sortname = "IND";

  openLogin() {
    this.bt.openModal('login');
  }

  closeModal() {
    this.bt.hideModal();
  }

  get f() {
    return this.InstituteForm.controls;
  }
  onSalesPersonSubmit() {
    this.submitted = true;
    if (this.InstituteForm.invalid) {
      return false;
    }
    const instituteObj = {
      name: this.InstituteForm.value.name,
      city: this.InstituteForm.value.city,
      street: this.InstituteForm.value.street,
      email: this.InstituteForm.value.email,
      website: this.InstituteForm.value.website,
      head: this.InstituteForm.value.head,
      head_contact_no: this.InstituteForm.value.head_contact_no,
      password: this.InstituteForm.value.password,
      institute_organization: 'organizationstaff'
    };
    this.createInstitute(instituteObj);

  }

  createInstitute(instituteObj) {
    this.misc.showLoader('short');
    this.networkRequest
      .postWithHeader(JSON.stringify(instituteObj), '/api/register_institute_staff/')
      .subscribe(
        data => {
          this.misc.hideLoader();
          this.InstituteForm.reset();
          this.submitted = false;
          this.alert.showAlert({ text: 'Account Created successfully. Please login with email and password!' }, 'success').subscribe();
          this.openLogin();
        },
        error => {
          this.misc.hideLoader();
          if (error['error']) {
            this.addServerErrors(error['error']);
          }
        }
      );
  }

  addServerErrors(error: object) {
    // Get Server Errors
    const errors = this.errorHandler.getFormErrors(error['errors']);
    // Assign Server Errors
    for (const err in errors) {
      if (errors.hasOwnProperty(err)) {
        this.InstituteForm.get(err).setErrors({
          serverError: errors[err]
        });
      }
    }
  }

  getStateList() {
    this.misc.showLoader('short');
    this.networkRequest.getWithHeaders(`/api/states/?country_sortname=${this.country_sortname}`).subscribe(
      (data: Array<object>) => {
        this.misc.hideLoader();
        this.stateList = data;
      },
      error => {
        this.misc.hideLoader();
        this.alert.showAlert({ text: 'Failed to load states' }, 'error').subscribe();
      }
    );
  }


  getCityList() {
    const state = this.InstituteForm.get('state').value;
    this.cityList = [];
    if (state) {
      this.misc.showLoader('short');
      this.networkRequest.getWithHeaders(`/api/cities/?state_id=${state}`).subscribe(
        (data: Array<object>) => {
          this.misc.hideLoader();
          this.cityList = data;
        },
        error => {
          this.misc.hideLoader();
          this.alert.showAlert({ text: 'Failed to load cities' }, 'error').subscribe();
        }
      );
    }
  }

  createInstituteForm() {
    this.InstituteForm = this.form.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      head: ['', [Validators.required, Validators.maxLength(20)]],
      head_contact_no: ['', [Validators.required, Validators.pattern(this.env.PHONE_REGEX)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.createInstituteForm();
    this.getStateList();
  }

}