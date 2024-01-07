import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { UtilsService } from '../../../../../core/services/utils.service';
import { AlertService } from '../../../../../services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private form: FormBuilder,
    private modalService: BsModalService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  @ViewChild('profileImageCropModal', { static: true }) cropProfileModalRef: TemplateRef<any>;
  @ViewChild('closeModal') closeModal: ElementRef;

  env = environment;
  modalRef: BsModalRef;
  invitation;

  /* [Profile form ] */
  profileForm = this.form.group({
    fullname: new FormControl({ value: '' }, [Validators.required]),
    // lastname: new FormControl({ value: ''}, [Validators.required]),
    email: new FormControl({ value: '',  disabled: false }),
    otp: [''],
    phone: new FormControl({ value: '' }, [Validators.required]),
    address: new FormControl({ value: '' }, [Validators.required]),
    city: new FormControl({ value: '' }),
    state: new FormControl({ value: '' }),
    zip: new FormControl({ value: ''}),
    domains: new FormControl(),
    qualification: new FormControl({ value: '' }),
    gender: new FormControl({ value: '' }),
    // // General Details
    // general: this.form.group({
      
    // }),

    // // institute Details
    // institute: this.form.group({
    //   institutename: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   studentClass: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   board: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   instituteCity: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   instituteState: new FormControl({ value: '', disabled: true }, [Validators.required]),
    // }),

    // Student Address
    // studentAddress: this.form.group({
      
    // }),

    // Parent Details
    // parentDetail: this.form.group({
    //   parentName: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   parentIncome: new FormControl({ value: '', disabled: true }, [Validators.required]),
    //   education: new FormControl({ value: '', disabled: true }, [Validators.required]),
    // })
  });


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
  myExams;
  /* Image Cropper */
  userImage: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  deletionExamId;

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

  synProfileSubscriber: Subscription;

  changeSchool() {
    // var confirmation = confirm("Are you sure you want to change your school?");
    //   if (confirmation) {
        this.networkRequest.putWithHeaders(null, `/api/approveinstitutechangerequest/`)
        .subscribe(
          data => {
            console.log("done ", data);
            this.instituteChangeRequest();
            this.getProfile();
            this.toastr.success('School Changed!', 'Success!', {
              timeOut: 4000,
            });
            this.closeModal.nativeElement.click();
            this.router.navigate(['/assessment/dashboard/profile']); 
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while changing the school!', 'Error!', {
              timeOut: 4000,
            });
          }
        );
      // }
  }

  logout() {
    this.auth.logout();
  }

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

    this.misc.showLoader('short');
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

  getProfile() {

    /**
     * Get User Profile and Sync with form
     */

    this.misc.showLoader('short');
    this.networkRequest.getWithHeaders('/api/profile/').subscribe(
      data => {
        console.log("profile details", data);
        this.userProfileObj = data['profile'];
        this.networkRequest.getWithHeaders('/api/statesList/').subscribe(
          data => {
            console.log("states", data);
            this.states = data;
            this.profileForm.patchValue({
              state: this.userProfileObj['state']
            });
            if (this.userProfileObj['state']) {
              this.networkRequest.getWithHeaders(`/api/citiesList/?state=${this.userProfileObj['state']}`).subscribe(
                data => {
                  console.log("cities", data);
                  this.cities = data;
                  this.profileForm.patchValue({
                    city: this.userProfileObj['city']
                  });
                },
                error => {
                  //("error", error);
                }
              )
            }
            else {
              this.profileForm.patchValue({
                city: null
              });
            }
          },
          error => {
            //("error", error);
          }
        )
        

        this.synProfileSubscriber = this.syncProfile(data['profile']).subscribe(data => {
        });
        this.misc.hideLoader();
      },
      error => {
        this.misc.hideLoader();
      }
    );
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }
  clearSelection() {
    this.deletionExamId = null;
  }

  removeExam(id) {
    // var confirmation = confirm("Are you sure you want to delink this exam?");
    // if (confirmation){
      this.networkRequest.putWithHeaders(null, `/api/learnerexam/${this.deletionExamId}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exam removed from your account!', 'Success!', {
            timeOut: 4000,
          });
          document.getElementById("dimissModal").click();
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while delinking exam!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    // }
  }

  removeAllExams() {
    var confirmation = confirm("Are you sure you want to delink all the exams?");
    if (confirmation){
      this.networkRequest.putWithHeaders(null, `/api/delinkalllearnerexams/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exams removed from your account!', 'Success!', {
            timeOut: 4000,
          });
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while delinking exams!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }
  getUserProfileImage() {

    /**
     * Get User Profile Image
     */

    this.misc.userProfile().subscribe(data => {
      if (data['image']) {
        this.userImage = data['image'];
      }
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // const profileData = {};
    var firstName = '';
    var fullname = (this.profileForm.value.fullname).split(' ');
    var lastName;
    if (fullname.length > 1) {
      for (let i = 0; i < fullname.length - 1; i++) {
        if (i == 0) {
          firstName = fullname[0];
        }
        else {
          firstName = firstName + ' ' + fullname[i];
        }
        
      }
      lastName = fullname[fullname.length -1];
    }
    else {
      firstName = fullname[0];
      lastName = '';
    }
    
    const formData = {
      first_name: firstName,
      last_name: lastName || '',
      interested_domains: this.profileForm.value.domains,
      email: this.profileForm.value.email || null,
      city: this.profileForm.value.city || null,
      state: this.profileForm.value.state || null,
      qualification: this.profileForm.value.qualification || null,
      gender: this.profileForm.value.gender || null,
    }

    this.misc.showLoader('short');
    this.networkRequest.putWithHeaders(formData, '/api/updateprofile/').subscribe(
      data => {
        // Set Profile Status
        console.log("updated", data);
        
        // Show feedback
        this.alertService.showAlert({ text: 'All changes saved' }, 'success').subscribe();
        this.misc.userProfileChange.next(true);
        this.misc.hideLoader();
        // this.getProfile();
      },
      error => {
        this.misc.hideLoader();
      }
    );
  }


  validProfileData(profileData) {

    /**
     * Email: If User Email is blank then add email(taken from form data) to post data
     *        If email is not blank and user tries to change email, show alert
     * Phone: If User adds a phone no. without verifying then show alert
     */

    // Remove Blank Fields
    for (let i in profileData) {
      if (!/\S/.test(profileData[i])) {
        delete profileData[i];
      }
    }

    // If not updated any information
    if (_.isEmpty(profileData)) {
      return false;
    }

    // Email Validation
    if (!this.userProfileObj['email']) {
      profileData['email'] = this.profileForm.value.email;
    } else if (this.profileForm.value.email) {
      // if ((this.userProfileObj['email'] !== this.profileForm.value.email)) {
      //   this.alertService.showAlert({ text: 'Cannot change email' }, 'info').subscribe();
      //   return false;
      // }
    }

    // Phone Validation
    // if (this.userPhone !== this.userProfileObj['contact_info'] && !this.phoneVerified) {
    //   this.allowSendOtp = true;
    //   this.alertService.showAlert({ text: 'Verify Phone to continue' }, 'warning').subscribe();
    //   return false;
    // }

    return true;
  }

  /**
   * [upadateProfileImage]
   * Update user profile (send user image on server)
   * Call getUserProfileImage() to get updated user profile
   * Update user userProfileChange Subject to update profile all over the app
   */
  upadateProfileImage() {

    /**
     * User Profile Update
     */

    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('profilepic')).files[0];
 

    // this.modalRef.hide();
    // let userImage = this.croppedImage.image;

    // // Convert Cropped Image into file
    // const imageBlob = new Blob([userImage], { type: 'image/png' });
    // userImage = new File([imageBlob], `profile-image-${(new Date()).getTime()}.png`, { type: 'image/png' });

    // Generate Form Data
    const formData: FormData = new FormData();
    formData.append('image', imageFile);
    console.log("aa");
    // Send User image to server
    this.misc.showLoader('short');
    this.misc.userProfile().subscribe(data => {
      this.networkRequest.putFiles(formData, `/api/profile/image/${data['user_id']}/`)
        .subscribe(
          data => {

            // Get updated user profile
            // this.getProfile();

            // Upadate user profile subject
            this.misc.userProfileChange.next(true);

            this.misc.hideLoader();
            this.getUserProfileImage();
          },
          error => {
            this.misc.hideLoader();
          });
    });
  }


  syncProfile(profile) {
    console.log("profile", profile);
    this.contactNumber = profile['contactNumber'];
    return new Observable(observer => {
      this.profileForm.patchValue({
        fullname: profile['first_name'] + ' ' + (profile['last_name'] || ''),
        // lastname: profile['last_name'],
        email: profile['email'],
        phone: profile['contact_info'],
        address: profile['address'],
        zip: profile['pincode'],
        domains: profile['interested_domains'],
        qualification: profile['qualification'],
        gender: profile['gender']
        // general: {
        //   firstname: profile['first_name'],
        //   lastname: profile['last_name'],
        //   email: profile['email'],
        //   phone: profile['contact_info'],
        // },
        // studentAddress: {
        //   address: profile['address'],
        //   zip: profile['pincode'],
        //   city: profile['city'] ? profile['city'] : '',
        //   state: profile['state'] ? profile['state'] : ''
        // },
      });

      // Make blank fields editable
      // this.togggleFieldEdit(null);

      observer.next({
        instituteState: profile['institute_state']
      });
    });
  }


  sendOtpToNumber() {
    if (this.contactNumber) {
      const formData = {
        contactNumber: this.contactNumber
      }
      this.networkRequest.putWithHeaders(formData, '/api/updatecontactsendotp/').subscribe(
        data => {
          console.log("otp sent", data);
          this.sendOtp = false;
          this.toastr.success('OTP Sent successfully!', 'Updated!', {
            timeOut: 4000,
          });
        },
        error => {
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }

  saveNewContact() {
    if (this.contactNumber) {
      const formData = {
        contactNumber: this.contactNumber,
        otp: this.otp
      }
      this.networkRequest.putWithHeaders(formData, '/api/updatecontact/').subscribe(
        data => {
          console.log("contact updated", data);
          this.sendOtp = true;
          this.otp = null;
          this.toastr.success('Contact updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
          // this.getProfile();
        },
        error => {
          this.misc.hideLoader();
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }


  onPhoneInput() {

    this.validPhone = false;
    this.phoneVerified = false;
    this.allowSendOtp = false;
    this.errors = null;

    if (this.userPhone.length === 10) {
      if (this.env.PHONE_REGEX.test(this.userPhone)) {
        this.allowSendOtp = true;
        this.validPhone = true;
      } else {
        this.errors = 'Enter a valid phone number';
      }
    }
  }


  onOtpInput() {

    this.errors = null;

    if (this.userOTP.length === this.env.OTP_LENGTH) {
      this.misc.verifyOtp(this.userOTP, this.userPhone).subscribe(
        data => {
          if (data) {
            this.phoneVerified = true;
            this.otpSent = false;
            this.allowSendOtp = false;
          }
        },
        error => {
          this.errors = error;
        }
      );
    }
  }


  changeUserProfile(imageInput: HTMLInputElement) {
    imageInput.click();
  }


  getBoardList() {
    this.networkRequest.getWithHeaders('/api/userboard/').subscribe(
      data => {
        this.boardList = data;
        console.log("boardList ", this.boardList);
      }
    );
  }


  getClassList() {
    this.networkRequest.getWithHeaders('/api/userclass/').subscribe(
      (data: any) => {

        data.sort((a, b) => {
          if (a['id'] < b['id']) {
            return -1;
          } else if (a['id'] > b['id']) {
            return 1;
          } else {
            return 0;
          }
        });

        this.studentClassList = data;
        console.log("studentClassList ", this.studentClassList);
      }
    );
  }


  getStateList() {
    this.networkRequest.getWithHeaders(`/api/states/?country_sortname=${this.env.COUNTRY_CODE}`).subscribe(
      data => {
        this.stateList = data;
      }
    );
  }


  getCityList(state, event, addressType = null) {

    const stateId = event ? event.target.value : state ? state : this.env.DEFAULT_STATE;

    this.networkRequest.getWithHeaders(`/api/cities/?state_id=${stateId}`).subscribe(
      data => {
        if (addressType === 'institute') {
          this.instituteCityList = data;
        } else if (addressType === 'home') {
          this.cityList = data;
        } else {
          this.instituteCityList = data;
          this.cityList = data;
        }
      }
    );
  }


  onProfileChange(event: any): void {

    /**
     * Validate Image Format
     * Set Image Change event equal to imageChangedEvent (to be used with cropper)
     */

    if (!this.env.ALLOWED_IMAGE_FORMATS.includes(event.target.files[0]['type'])) {
      this.alertService.showAlert({ text: 'Invalid image format' }, 'error').subscribe(() => {
        // this.cook
      });
      return;
    }

    // Show Cropper
    this.modalRef = this.modalService.show(this.cropProfileModalRef);
    this.imageChangedEvent = event;
  }


  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = {
      image: event.base64,
      url: event.base64
    };
  }


  imageLoaded() {
    // show cropper
  }


  cropperReady() {
    // cropper ready
  }


  loadImageFailed() {
    this.alertService.showAlert({ text: 'Image load failed, try diffrent image' }, 'error').subscribe();
  }

  /**
   * [togggleFieldEdit]
   * If field then enable particular fields set (general, parent, institute, address)
   * field will be null on page load, then enable all blank fields
   * @param field
   */
  togggleFieldEdit(field) {

    let fieldList, generalFields, instituteFields, studentAddressFields, parentFields;

    if (field) {
      if (field['general']) {
        fieldList = this.profileForm.get('general')['controls'];
        delete fieldList['email'];
      } else if (field['institute']) {
        fieldList = this.profileForm.get('institute')['controls'];
      } else if (field['address']) {
        fieldList = this.profileForm.get('studentAddress')['controls'];
      } else if (field['parent']) {
        fieldList = this.profileForm.get('parentDetail')['controls'];
      }

      for (const i in fieldList) {
        if (fieldList[i]) {
          fieldList[i].enable();
        }
      }

    } else {

      generalFields = this.profileForm.get('general')['controls'];
      instituteFields = this.profileForm.get('institute')['controls'];
      studentAddressFields = this.profileForm.get('studentAddress')['controls'];
      parentFields = this.profileForm.get('parentDetail')['controls'];

      /* List of all fields */
      fieldList = { ...generalFields, ...instituteFields, ...studentAddressFields, ...parentFields };

      for (const i in fieldList) {
        if (fieldList[i]) {

          // Enable blank fields
          if (!fieldList[i].value) {
            fieldList[i].enable();
          }
        }
      }
    }
  }

  getDomains() {
    this.networkRequest.getWithHeaders('/api/domain/')
      .subscribe(
        data => {
          console.log("domains ", data);
          // Populate Selected Assessment list with server data
          this.domains = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  fetchStates() {
    this.networkRequest.getWithHeaders('/api/statesList/').subscribe(
      data => {
        console.log("states", data);
        this.states = data;
      },
      error => {
        //("error", error);
      }
    )
  }

  setDeletionId(id) {
    this.deletionExamId = id;
  }

  instituteChangeRequest() {
    this.networkRequest.getWithHeaders(`/api/fetchstudentincominginstitutechangerequest/`).subscribe(
      data => {
        console.log("invitation ", data);
        this.invitation = data;
        // this.share.setclassList(data['students']);
      },
      error => {
      });
  }

  ngOnInit() {
    this.getDomains();
    this.getBoardList();
    this.getClassList();
    // this.fetchStates();
    this.getProfile();
    this.getUserProfileImage();
    this.getMyExams();
    this.instituteChangeRequest();
  }


  ngOnDestroy() {
    this.synProfileSubscriber.unsubscribe();
  }

}
