import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.scss']
})
export class MentorProfileComponent implements OnInit, OnDestroy {

  constructor(
    private auth: AuthService,
    private networkRequest: NetworkRequestService,
    private form: FormBuilder,
    private alertService: AlertService,
    private misc: MiscellaneousService,
    private toastr: ToastrService
  ) { }

  synProfileSubscriber: Subscription;

  profileForm = this.form.group({
    fullname: new FormControl({ value: '' }, [Validators.required]),
    lastname: new FormControl({ value: ''}, [Validators.required]),
    email: new FormControl({ value: '',  disabled: false},[Validators.required,Validators.email]),
    phone: new FormControl({ value: '' }, [Validators.required]),
    city: new FormControl({ value: '' }),
    state: new FormControl({ value: '' }),
    qualification: new FormControl({ value: '' }),
    gender: new FormControl({ value: '' })
  });

  userProfileObj: any;
  contactNumber;
  otp;
  sendOtp: boolean = true;
  password;
  confirmPassword;
  states;
  cities;
  stateList;
  email;
  fullname;

  get f() {
    return this.profileForm.controls;
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
  logout() {
    this.auth.logout();
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

  changeUserProfile(imageInput: HTMLInputElement) {
    imageInput.click();
  }

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
            this.getProfile();

            // Upadate user profile subject
            this.misc.userProfileChange.next(true);

            this.misc.hideLoader();
          },
          error => {
            this.misc.hideLoader();
          });
    });
  }

  onSubmit() {
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
        
          this.alertService.showAlert({ text: 'All changes saved' }, 'success').subscribe();
          this.misc.userProfileChange.next(true);
          this.misc.hideLoader();

        },
        error => {
          this.misc.hideLoader();
        }
      );
  }

  // // onSave() {
  // //   console.log(this.profileForm);
  // }

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

  syncProfile(profile) {
    console.log("profile", profile);
    this.contactNumber = profile['contactNumber'];
    return new Observable(observer => {
      this.profileForm.patchValue({
        fullname: profile['first_name'] + ' ' + profile['last_name'],
        lastname: profile['last_name'],
        email: profile['email'],
        phone: profile['contact_info'],
        qualification: profile['qualification'],
        gender: profile['gender']
      });

      // Make blank fields editable
      // this.togggleFieldEdit(null);

      observer.next({
        state: profile['state'],
        instituteState: profile['institute_state']
      });
    });
  }

  ngOnInit(): void {
    this.getProfile();
    // this.fetchStates();
    this.misc.userProfileChange.subscribe(
      data => {
        this.getProfile();
      }
    );
  }

  ngOnDestroy() {
    this.synProfileSubscriber.unsubscribe();
  }

}
function getProfile() {
  throw new Error('Function not implemented.');
}

