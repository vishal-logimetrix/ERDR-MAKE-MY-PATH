import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AlertService } from 'src/app/services/alert.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(
    private form: FormBuilder,
    private modalService: BsModalService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private alertService: AlertService,
    private toastr: ToastrService
  ) { }

  
  /* Profile Form Data */
  userProfileObj: any;
  boardList: any;
  studentClassList: any;
  stateList: any;
  cityList: any;
  instituteCityList: any;

  /* Phone Validation */
  userPhone: any;
  userOTP: any;
  validPhone = false;
  otpSent = false;
  allowSendOtp = false;
  phoneVerified = false;

  /* Image Cropper */
  userImage: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  /* Allow Profile Edit */
  disabledField = {
    general: true,
    institute: true,
    address: true,
    parent: true
  };

  submitted = false;

  errors: any;
  feedback = null;
  domains;
  states;
  cities;
  contactNumber;
  sendOtp: boolean = true;
  otp;
  password;
  confirmPassword;


  savePassword() {
    if (this.password != this.confirmPassword) {
      this.toastr.error("Password and confirm password", 'Error!', {
        timeOut: 4000,
      });
      return;
    }

    const user = {
      password: this.password
    };

    this.misc.showLoader('short')
    this.networkRequest.putWithHeaders(JSON.stringify(user), '/api/users/updatepassword/').subscribe(
      user => {
        console.log("user", user);
        this.misc.hideLoader();
        this.password = null;
        this.confirmPassword = null;
        this.toastr.success("Successful!", 'Done!', {
          timeOut: 4000,
        });
      },
      error => {
        this.misc.hideLoader();
        this.toastr.error(error, 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  ngOnInit(): void {
  }

}
