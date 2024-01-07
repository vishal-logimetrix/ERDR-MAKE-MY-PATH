import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-choose-subtype',
  templateUrl: './choose-subtype.component.html',
  styleUrls: ['./choose-subtype.component.scss']
})
export class ChooseSubtypeComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService
  ) { }
  
  domainId;
  domainDetail;
  journeys;
  currentNode;
  announcements;
  categoryDetails;
  links;
  max_page: number;
  pages = [];
  currentPage: number = 1;
  startPage: number = 1;
  endPage: number = 1;
  subNode;

  checkOverflow (element) {
    return element.offsetHeight < element.scrollHeight ||
           element.offsetWidth < element.scrollWidth;
  }

  selectExam(id) {
    this.courseswitchservice.updateExamId(id);
  }

  getDomainNodeDetails(id) {
    this.networkRequest.getWithHeaders(`/api/domainnode/${id}/`)
    .subscribe(
      data => {
        console.log("node details ", data);
        this.currentNode = data;
        if (this.currentNode['successive_nodes'].length == 0 && this.currentNode['linked_exam']) {
          this.router.navigate([`/assessment/dashboard/choose-p/${this.currentNode['linked_exam']['id']}`]);
        }
        else {
          this.currentNode['successive_nodes'].sort((a, b) => a.text.localeCompare(b.text , undefined, { numeric: true, sensitivity: 'base' }));
        }
      },
      error => {
      });
  }

  getInitialNode() {
    this.networkRequest.getWithHeaders(`/api/initialdomainnode/?domain_id=${this.domainId}`)
    .subscribe(
      data => {
        console.log("initial node ", data);
        this.currentNode = data[0];
        if (this.currentNode['successive_nodes'].length == 0 && this.currentNode['linked_exam']) {
          this.router.navigate([`/assessment/dashboard/choose-p/${this.currentNode['linked_exam']['id']}`]);
        }
        else {
          this.currentNode['successive_nodes'].sort((a, b) => a.text.localeCompare(b.text , undefined, { numeric: true, sensitivity: 'base' }));
        }
      },
      error => {
      });
  }

  fetchDomainDetails() {
    this.networkRequest.getWithHeaders(`/api/domain/${this.domainId}/`)
    .subscribe(
      data => {
        console.log("domain details ", data);
        this.domainDetail = data;
        this.networkRequest.getWithHeaders(`/api/examcategory/${this.domainDetail['exam_category'][0]}/`)
        .subscribe(
          data => {
            console.log("category details ", data);
            this.categoryDetails = data;
          },
          error => {
          });
        if (!this.currentNode) {
          this.getInitialNode();
        }
        if (this.subNode) {
          setTimeout(() => {
            this.getDomainNodeDetails(this.subNode);
          }, 1000);
        }
        this.goToPage(1);
      },
      error => {
      });
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.fetchAnnouncements();
  }

  fetchAnnouncements() {
    this.networkRequest.getWithHeaders(`/api/domainannouncement/?domain=${this.domainId}&page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("announcements ", data);
        this.announcements = data['results'];
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
        console.log("erroraa ", error);
      }
    );
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.subNode = params.node;
    });
    this.route.params.subscribe(
      data1 => {
        if (data1['domain']) {
          this.domainId = data1['domain'];
          this.fetchDomainDetails();
        }
      }
    );
    // this.courseswitchservice.courseIdStatus.subscribe(
    //   data => {
    //     // if (!data) {
    //     //   this.route.params.subscribe(
    //     //     data1 => {
    //     //       if (data1['domain']) {
    //     //         this.courseswitchservice.updateCourseId(data1['domain']);
    //     //         this.domainId = data1['domain'];
    //     //         this.fetchDomainDetails();
    //     //       }
    //     //     }
    //     //   );
    //     // }
    //     // else {
    //     //   this.domainId = data;
    //     //   this.fetchDomainDetails();
    //     // }
    //     this.route.params.subscribe(
    //       data1 => {
    //         if (data1['domain']) {
    //           // this.courseswitchservice.courseIdStatus.subscribe(
    //           //   data => {
    //           //     if (data) {
    //           //       this.courseswitchservice.updateCourseId(data1['domain']);
    //           //     }
    //           //   });
    //           this.domainId = data1['domain'];
    //           this.fetchDomainDetails();
    //         }
    //         else {
    //           this.domainId = data;
    //           this.fetchDomainDetails();
    //         }
    //       }
    //     );
    // });
  }

}
