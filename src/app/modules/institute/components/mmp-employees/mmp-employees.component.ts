import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-mmp-employees',
  templateUrl: './mmp-employees.component.html',
  styleUrls: ['./mmp-employees.component.scss']
})
export class MmpEmployeesComponent implements OnInit {

  schoolTeachers;
  schoolAdmins;
  showSchoolAdmins: boolean = true;
  tmpSchoolStaffs = [];
  schoolName;
  schoolAddress;
  schoolCode;
  selectedSchool;
  displayMode;

  //initializing p to one
  p: number = 1;
  ps: number = 1;
  pt: number = 1;
  addUserForm: FormGroup;
  domains;
  listFlag: boolean = true;
  editFlag: boolean = false;
  paymentFlag: boolean = false;
  doctorDetail;
  paymentAmount;
  paymentMode;
  paymentId;
  bank;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  max_pageC: number;
  pagesC = [];
  currentPageC: number;
  startPageC: number = 1;
  endPageC: number = 1;
  contentManagers;

  get name() {
    return this.addUserForm.get("name");
  }

  get surname() {
    return this.addUserForm.get("surname");
  }

  // get username() {
  //   return this.addUserForm.get("username");
  // }

  get email() {
    return this.addUserForm.get("email");
  }

  get isactive() {
    return this.addUserForm.get("isactive");
  }

  get contactNumber() {
    return this.addUserForm.get("contactNumber");
  }

  get domain() {
    return this.addUserForm.get("domain");
  }

  get displayFees() {
    return this.addUserForm.get("displayFees");
  }

  get actualFees() {
    return this.addUserForm.get("actualFees");
  }

  get city() {
    return this.addUserForm.get("city");
  }

  get about() {
    return this.addUserForm.get("about");
  }

  get mode() {
    return this.addUserForm.get("mode");
  }

  get doctorType() {
    return this.addUserForm.get("doctorType");
  }

  validateMsg;
  cities;
  selectedDoctor;

  constructor(
    private router: Router,
    private permissions: PermissionsService,
    private profileservice: ProfileService,
    private toastr: ToastrService,
    private networkRequest: NetworkRequestService,
    private auth: AuthService,
    private cookie: CookieService,
    private utils: UtilsService
  ) {
   }

  isMMPAdmin = this.permissions.isMMPAdmin();

  openListPage() {
    this.addUserForm.reset();
    this.listFlag = true;
    this.editFlag = false;
    this.paymentFlag = false;
  }

  logoutUser(id) {
    this.networkRequest.putWithoutHeaders(null, `/api/profile/updateuserlogout/${id}/`)
    .subscribe(
      data => {
        console.log("logout time updated ", data);
        this.toastr.success('User logged out!', 'Success!', {
          timeOut: 5000,
        });
      },
      error => {
        this.toastr.error(error['message']['error']['message'], 'Error!', {
          timeOut: 5000,
        });
    });
  }

  deleteUser(id) {
    var confirmation = confirm("Are you sure you want to delete this user?");
    if (confirmation) {
      this.networkRequest.putWithoutHeaders(null, `/api/profile/deleteuser/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.toastr.success('User Deleted!', 'Success!', {
            timeOut: 5000,
          });
          this.goToPageC(this.currentPageC);
        },
        error => {
          this.toastr.error(error['message']['error']['message'], 'Error!', {
            timeOut: 5000,
          });
      });
    }
  }

  submitAdminForm() {

    // admin form data
    const username = this.selectedDoctor;
    const email = this.addUserForm.value.email;
    const contactNumber = this.addUserForm.value.contactNumber;

    const name = this.addUserForm.value.name;
    const surname = this.addUserForm.value.surname;
    const about = this.addUserForm.value.about;
    const actualfees = this.addUserForm.value.actualfees;
    const displayfees = this.addUserForm.value.displayfees;
    const city = this.addUserForm.value.city;
    const animals = this.addUserForm.value.domain;
    const isactive = this.addUserForm.value.isactive;
    const mode = this.addUserForm.value.mode;
    const doctorType = this.addUserForm.value.doctorType;

    const profileData = {
      username: username,
      name: name,
      surname: surname,
      contactNumber: contactNumber,
      email: email,
      about: about,
      actualfees: actualfees,
      displayfees: displayfees,
      city: city,
      animals: animals,
      isactive: isactive,
      mode: mode,
      doctorType: doctorType
    }

    // this.adminservice.editDoctorProfile(profileData).subscribe(
    //   data => {
    //     this.fetchSchoolStaffs();
    //     this.addUserForm.reset();
    //     this.editFlag = false;
    //     this.paymentFlag = false;
    //     this.listFlag = true;
    //     this.toastr.success('Profile successfully updated!', 'Success!', {
    //       timeOut: 5000,
    //     });
    //   },
    //   error => {
    //     this.toastr.error(error['message']['error']['message'], 'Error!', {
    //       timeOut: 5000,
    //     });
    //   }
    // )

  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchSchoolStaffs();
  }

  goToPageC(pageIndex) {
    this.currentPageC = pageIndex;
    this.fetchContentManagers();
  }

  fetchSchoolStaffs() {
   
    this.networkRequest.getWithHeaders(`/api/searchuser/?role=admin&page=${this.currentPage}`).subscribe(
      data => {
        console.log("users ", data);
        this.schoolAdmins = data['results'];
        let page_size = data['page_size'];
        if (data['count'] % page_size === 0) {
          this.max_page = Math.floor(data['count'] / page_size);
        } else {
          this.max_page = Math.floor(data['count'] / page_size) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
        if (this.max_page < 11) {
          // less than 10 total pages so show all
          this.startPage = 1;
          this.endPage = this.max_page;
        } else if (this.currentPage < 6) {
          this.startPage = 1;
          this.endPage = 10;
        } else if (this.currentPage >= 6 && this.currentPage < this.max_page - 5) {
          this.startPage = this.currentPage - 4;
          this.endPage = this.currentPage - (-5);
        } else {
          this.startPage = this.max_page - 9;
          this.endPage = this.max_page;
        }
      },
      error => {
        console.log("error ", error);
      }
    )

    let urlParam1 = "role=principal";

    //"urlParam ", urlParam);

  }

  fetchContentManagers() {
   
    this.networkRequest.getWithHeaders(`/api/searchuser/?role=content_manager&page=${this.currentPage}`).subscribe(
      data => {
        console.log("users ", data);
        this.contentManagers = data['results'];
        let page_size = data['page_size'];
        if (data['count'] % page_size === 0) {
          this.max_pageC = Math.floor(data['count'] / page_size);
        } else {
          this.max_pageC = Math.floor(data['count'] / page_size) + 1;
        }
        this.pagesC = ' '.repeat(this.max_pageC).split('');
        if (this.max_pageC < 11) {
          // less than 10 total pages so show all
          this.startPageC = 1;
          this.endPageC = this.max_pageC;
        } else if (this.currentPageC < 6) {
          this.startPageC = 1;
          this.endPageC = 10;
        } else if (this.currentPageC >= 6 && this.currentPageC < this.max_pageC - 5) {
          this.startPageC = this.currentPageC - 4;
          this.endPageC = this.currentPageC - (-5);
        } else {
          this.startPageC = this.max_pageC - 9;
          this.endPageC = this.max_pageC;
        }
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  getUserProfile() {
    const token = this.cookie.get('_l_a_t');
    const decoded_token = this.utils.decodeToken(token);
    this.networkRequest.getWithHeaders('/api/shortprofile/').subscribe(
      data => {
        var tokenDate = new Date(decoded_token['logged_on']);
        var tmpDate = new Date(data['profile']['logout_updated_on']);
        
        if (!decoded_token['logged_on']) {
          this.auth.logout();
        }
        if (tmpDate.getTime() >= tokenDate.getTime()) {
          this.auth.logout();
        }
      },
      error => {
      }
    );
  }

  ngOnInit(): void {
    this.goToPage(1);
    this.goToPageC(1);
    // this.getUserProfile();
  }


}
