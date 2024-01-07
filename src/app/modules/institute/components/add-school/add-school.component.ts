import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-school.component.html',
  styleUrls: ['./add-school.component.scss']
})
export class AddSchoolComponent implements OnInit {

  title : string;
  description : string;
  order : number;
  domainForm: FormGroup;
  states;
  cities;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private auth: AuthService,
    private utils: UtilsService
  ) { }

  get f() {
    return this.domainForm.controls;
  }
  errors;
  schoolId;

  fetchStateCities(stateId) {
    this.cities = null;
    this.networkRequest.getWithHeaders(`/api/citiesList/?state=${stateId}`)
      .subscribe(
        data => {
          console.log("cities ", data);
          this.cities = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  submitForm() {
    const formData = {
      name: this.domainForm.value.name,
      email: this.domainForm.value.email,
      website: this.domainForm.value.website,
      head: this.domainForm.value.head,
      head_contact_no: this.domainForm.value.headcontact,
      city: this.domainForm.value.city,
      street: this.domainForm.value.street,
      is_verified: this.domainForm.value.isActive,
      school_code: this.domainForm.value.code,
      pin: this.domainForm.value.pin,
      registered: true
    }

    this.networkRequest.postFormData(formData, '/api/createinstitute/').subscribe(
      data => {
        console.log("school successfully created ", data);
        this.schoolId = data['institute']['id'];
        this.register();
        this.toastr.success('School created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  register() {

    const fullname = this.domainForm.value.head;
    const phone = this.domainForm.value.headcontact;

    const user = {
      user: {
        phonenumber: phone,
        fullname: fullname,
        password: this.domainForm.value.password
      }
    };

    if (fullname && phone) {
      this.auth.register(JSON.stringify(user), '/api/users/register/').subscribe(
        user => {
          console.log("user", user);
          if (user['user']) {
            // this.bt.openModal('otp', user); 
            const userData = {
              user_group: 'principal'
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
              const schoolData = {
                institute: this.schoolId
              }
              this.networkRequest.putWithoutHeaders(schoolData, `/api/profile/userschoolandverify/${user_id}/`)
            .subscribe(
              data => {
                console.log("school updated ", data);
              },
              error => {
              });
              this.router.navigate(["/"]);
          }
        },
        error => {
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

  createDomainForm() {
    this.domainForm = this.fb.group({
      name: ['', Validators.required],
      isActive: [false, [Validators.required]],
      email: ['', [Validators.required]],
      website: [''],
      head: ['', [Validators.required]],
      password: [''],
      headcontact: [''],
      code: [''],
      pin: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
      street: ['']
    })
  }

  getStates() {
    this.networkRequest.getWithHeaders('/api/statesList/')
      .subscribe(
        data => {
          console.log("states", data);
          // Populate Selected Assessment list with server data
          this.states = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getStates();
    this.createDomainForm();
    this.title = this.route.snapshot.params['title'];
    this.description = this.route.snapshot.params['description'];
    this.order = parseInt(this.route.snapshot.params['order']);
  }
}
