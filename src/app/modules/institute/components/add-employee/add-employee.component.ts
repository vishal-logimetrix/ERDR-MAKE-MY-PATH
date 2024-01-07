import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantsService } from 'src/app/core/services/constants.service';
import { LoginService } from 'src/app/core/services/login.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  constructor(
    private authservice: AuthService,
    private loginservice: LoginService,
    private consts: ConstantsService,
    private toastr: ToastrService,
    private permissionsvc: PermissionsService,
    private router: Router,
    private fb: FormBuilder,
    private networkRequest: NetworkRequestService
  ) { }

  username: string;
  password: string;
  togglePassword: boolean = false;
  successMsg;
  loaderActive: boolean = false;
  errors = null;
  userData: any;
  isAuthenticated = this.permissionsvc.isauthenticated();
  signupForm: FormGroup;

  get f() {
    return this.signupForm.controls;
  }

  resetValidations() {
    this.errors = null;
    this.loaderActive = false;
  }

  signup() {
    this.errors = null;
    this.successMsg = null;
    this.loaderActive = true;
    let finalData: any;
    const name = this.signupForm.value.name;
    const surname = this.signupForm.value.surname;
    const email = this.signupForm.value.email;
    const contactNumber = this.signupForm.value.contactNumber;
    const role = this.signupForm.value.role;

    finalData = {
      first_name: name,
      last_name: surname,
      email: email,
      phonenumber: contactNumber,
      user_group: role
    }

    this.networkRequest.postWithHeader(finalData, `/api/adduser/`)
      .subscribe(
        user => {
          //user, "student add")
            this.loaderActive = false;
            // this.showOTPForm = true;
            // this.hideLoginSignup = true; 
            // this.router.navigate(['user']);    
            this.toastr.success('Registered successfully!', 'Loading..!', {
              timeOut: 4000,
            });
            this.signupForm.reset();
        },
        error => {
          this.loaderActive = false;
          //"Error section")
          this.errors = error['error']['detail'];
          //this.errors);
          
          this.toastr.error(this.errors, 'Error!', {
            timeOut: 5000,
          });
        }
      );
  }

  createSignUpForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern("^[a-zA-Z\-\']+")]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.pattern("^[a-zA-Z\-\']+")]],
      email: ['', Validators.required],
      contactNumber: ['', Validators.required],
      role: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.createSignUpForm();
  }

}
