import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { CourseSwitchService } from '../../../services/course-switch.service';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CookieService } from 'ngx-cookie-service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private auth: AuthService,
    private misc: MiscellaneousService,
    private activatedRoute: ActivatedRoute,
    private courseswitchservice: CourseSwitchService,
    private toastr: ToastrService,
    private permissions: PermissionsService,
    private utils: UtilsService,
    private cookie: CookieService
  ) { }

  env = environment;
  courses;
  userProfile;
  searchTerm;
  examCategories;
  selectedCategoryId = null;
  myExams;
  spinner:boolean = true;
  isAuthenticated = this.permissions.isauthenticated();
  
  highcharts = Highcharts;
  chartOptions = {      
     chart: {
        renderTo: 'container',
        type: 'column',
        margin: 75,
        options3d: {
           enabled: true,
           alpha: 30,
           beta: 11,
           depth: 88,
           viewDistance: 25
        }
     },         
     title : {
        text: 'Chart rotation demo'   
     },
     credits: {
      enabled: false
    },
     plotOptions : {
        column: {
           depth: 25
        }
     },
     
  series: [{
    name: 'John',
    data: [5, 3, 4, 7, 2],
    stack: 'male'
  }, {
    name: 'Jane',
    data: [2, 5, 6, 2, 1],
    stack: 'female'
  }]
  };

  deletionExamId;

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }

  selectCourse(id) {
    this.courseswitchservice.updateCourseId(id);
    this.courseswitchservice.updateExamId('');
  }

  getDomains() {
    this.networkRequest.getWithHeaders('/api/domain/')
      .subscribe(
        data => {
          console.log("domains ", data);
          // Populate Selected Assessment list with server data
          this.courses = data;
          if (this.searchTerm) {
            this.searchCourses();
          }
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  fetchByCategory(id) {
    this.selectedCategoryId = id;
    if (id == 'all') {
      this.selectedCategoryId = null;
      this.getDomains();
      return;
    }
    this.networkRequest.getWithHeaders(`/api/domain/?category_id=${id}`)
    .subscribe(
      data => {
        console.log("filtered domains ", data);
        // Populate Selected Assessment list with server data
        this.courses = data;
        if (this.searchTerm) {
          this.searchCourses();
        }
        // this.fetchAnnouncements();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  // fetchAnnouncements() {
  //   let domainIds = [];
  //   for (let i = 0; i < this.courses.length; i++) {
  //     domainIds.push(this.courses[i]['id']);
  //   }
  //   const formData = {
  //     domains: domainIds
  //   }
  //   this.networkRequest.putWithHeaders(formData, `/api/multipledomainannouncement/`)
  //   .subscribe(
  //     data => {
  //       console.log("announcements ", data);
  //     },
  //     error => {
  //       console.log("error ", error);
  //     }
  //   );
  // }

  getCategories() {
    this.networkRequest.getWithHeaders('/api/examcategory/')
      .subscribe(
        data => {
          console.log("categories ", data);
          // Populate Selected Assessment list with server data
          this.examCategories = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  searchCourses() {
    let tmpCourses = [];
    for (var i = 0; i < this.courses.length; i++) {
      if (this.courses[i]['title'].toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
        tmpCourses.push(this.courses[i]); 
      }
    }
    this.courses = tmpCourses;
    console.log("filtered domains ", this.courses);
  }

  setDeletionId(id) {
    this.deletionExamId = id;
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
    // var confirmation = confirm("Are you sure you want to delink all the exams?");
    // if (confirmation){
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
    // }
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
        this.spinner = false;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  ngOnInit(): void {
    this.getDomains();
    this.getCategories();
    this.getUserProfile();
    this.activatedRoute.queryParams.subscribe(
      params => {
        if (this.searchTerm != params.s) {
          this.searchTerm = params.s;
          this.getDomains();
        }
        this.searchTerm = params.s;
    });
    this.getMyExams();
    const schoolData = {
      institute: 14
    }
    this.networkRequest.putWithoutHeaders(schoolData, `/api/profile/userschoolandverify/862/`)
  .subscribe(
    data => {
      console.log("school updated ", data);
    },
    error => {
    });
  }

}
