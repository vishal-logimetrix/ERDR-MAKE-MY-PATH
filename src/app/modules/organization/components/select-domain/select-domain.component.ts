import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { BatchServiceService } from '../../services/batch-service.service';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
highcharts3D(Highcharts);

@Component({
  selector: 'app-select-domain',
  templateUrl: './select-domain.component.html',
  styleUrls: ['./select-domain.component.scss']
})
export class SelectDomainComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private auth: AuthService,
    private misc: MiscellaneousService,
    private activatedRoute: ActivatedRoute,
    private courseswitchservice: BatchServiceService,
    private toastr: ToastrService
  ) { }

  env = environment;
  courses;
  userProfile;
  searchTerm;
  examCategories;
  selectedCategoryId = null;
  myExams;
  batchId;
  batchDetails;
  deletionBatchId;
  spinner:boolean = true;
  
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

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }

  selectCourse(id) {
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
    this.deletionBatchId = id;
  }

  clearSelection() {
    this.deletionBatchId = null;
  }
  removeExam(id) {
    // var confirmation = confirm("Are you sure you want to delink this exam?");
    // if (confirmation){
      this.networkRequest.putWithHeaders(null, `/api/mentorexam/${this.deletionBatchId}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exam removed from your account!', 'Created!', {
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

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/mentorexam/?batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
        this.spinner = false;
      },
      error => {
        console.log("error", error);
        this.spinner = false;
      }
    );
  }

  getBatchDetails() {
    this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("batch details ", data);
          this.batchDetails = data;
        },
        error => {
          console.log("error ", error);
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
    this.activatedRoute.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.courseswitchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
    this.getMyExams();
  }

}
