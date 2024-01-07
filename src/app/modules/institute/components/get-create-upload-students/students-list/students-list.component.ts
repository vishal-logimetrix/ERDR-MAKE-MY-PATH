import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { InstituteService } from '../../../services/institute.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {

  constructor(
    private router: Router,
    private instituteService: InstituteService,
    private networkRequest: NetworkRequestService,
    private form: FormBuilder,
    private alertService: AlertService,
    private misc: MiscellaneousService
    ) { }

  username="";
  aa:boolean=false;

  users: any = [];
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  showListFlag: boolean = true;
  selectedUsername;
  selectedUserExams;

  profileForm = this.form.group({
    firstname: new FormControl({ value: '' }, [Validators.required]),
    lastname: new FormControl({ value: ''}, [Validators.required]),
    email: new FormControl({ value: '',  disabled: false }),
    otp: [''],
    phone: new FormControl({ value: '' }, [Validators.required]),
    address: new FormControl({ value: '' }, [Validators.required]),
    city: new FormControl({ value: '' }),
    state: new FormControl({ value: '' }),
    zip: new FormControl({ value: ''}, [Validators.required]),
    domains: new FormControl(),
   
  });

  get f() {
    return this.profileForm.controls;
  }

  showStudentsList() {
    this.showListFlag = true;
    this.selectedUsername = null;
    this.selectedUserExams = null;
  }

  onSubmit() {
    const profileData = {};

    profileData['first_name'] = this.profileForm.value.firstname;
    profileData['last_name'] = this.profileForm.value.lastname;
    // profileData['interested_domains'] = this.profileForm.value.domains;
    profileData['email'] = this.profileForm.value.email;
    profileData['username'] = this.selectedUsername;
   
      this.misc.showLoader('short');
      this.networkRequest.putWithHeaders(profileData, '/api/updateprofile/').subscribe(
        data => {
          // Set Profile Status
          console.log("updated", data);
          // this.utils.setCookieData({ '_ps': data['user']['complete_profile'] === 'False' ? false : true });

          // // Set Profile Required Status
          // this.utils.setCookieData({ '_pr': data['user']['complete_profile'] === 'False' ? true : false });

          // Show feedback
          this.alertService.showAlert({ text: 'All changes saved' }, 'success').subscribe();
          this.misc.hideLoader();

        },
        error => {
          this.misc.hideLoader();
        }
      );
  }


  setIndex(ii){
    this.aa=ii;
    console.log
  }

  edit(profile){
    this.selectedUsername = profile['username'];
    this.selectedUserExams = profile['enrolledexams'];
    console.log("profile", profile['first_name']);
    this.showListFlag = false;
    this.profileForm.patchValue({
      firstname: profile['first_name'],
      lastname: profile['last_name'],
      email: profile['email'],
      // phone: profile['phonenumber'],
      // address: profile['address'],
      // zip: profile['pincode'],
      // city: profile['city'] ? profile['city'] : '',
      // state: profile['state'] ? profile['state'] : '',
      // domains: profile['interested_domains']
      
    });
  }

  searchStudent() {
    if (this.username == '') {
      this.goToPage(1);
      return;
    }
    this.networkRequest.getWithHeaders(`/api/studentsList/?username=${this.username}`).subscribe(
      data => {
        console.log("searched student ", data);
        this.users = data['results'];
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  fetchStudentsList() {
    this.networkRequest.getWithHeaders(`/api/studentsList/?page=${this.currentPage}`).subscribe(
      data => {
        console.log("students list ", data);
        this.users = data['results'];
        let page_size = data['page_size'];
        this.links = data['links'];
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
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchStudentsList(); 
  }

  ngOnInit(): void {
    this.goToPage(1);
  }
  
}