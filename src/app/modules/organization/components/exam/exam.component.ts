import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  selectedCategoryId = null;
  courses;
  searchTerm;
  examCategories;
  announcements;
  categoryDetails;
  batchId;
  batchDetails;
  links;
  max_page: number;
  pages = [];
  currentPage: number = 1;
  startPage: number = 1;
  endPage: number = 1;

  constructor(private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: BatchServiceService
  ) { }


  checkOverflow (element) {
    return element.offsetHeight < element.scrollHeight ||
           element.offsetWidth < element.scrollWidth;
  }

  
    selectExam(id) {
      this.courseswitchservice.updateExamId(id);
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

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/examcategory/${id}/`)
    .subscribe(
      data => {
        console.log("category details ", data);
        this.categoryDetails = data;
      },
      error => {
      });
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
        this.goToPage(1);
      },
      error => {
        console.log("error ", error);
      }
    );
  }
  selectCourse(id) {
    // this.courseswitchservice.updateCourseId(id);
    this.courseswitchservice.updateExamId('');
  }
  
  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchAnnouncements();
  }
  
  fetchAnnouncements() {
    // let domainIds = [];
    // for (let i = 0; i < this.courses.length; i++) {
    //   domainIds.push(this.courses[i]['id']);
    // }
    // const formData = {
    //   domains: domainIds
    // }
    let domainIds;
    for (let i = 0; i < this.courses.length; i++) {
      if (i==0) {
        domainIds = this.courses[i]['id'];
      }
      else {
        domainIds = domainIds + ','+ this.courses[i]['id'];
      }
    }
    this.networkRequest.getWithHeaders(`/api/multipledomainannouncement/?domains=${domainIds}&page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("announcements ", data);
        this.announcements = data;
      },
      error => {
        console.log("error ", error);
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
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.courseswitchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
    const id = this.route.snapshot.paramMap.get('category');
    // console.log(id);
    this.fetchByCategory(id);
    this.fetchDetails(id);
  }

}
