import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-exam-notification-request',
  templateUrl: './exam-notification-request.component.html',
  styleUrls: ['./exam-notification-request.component.scss']
})
export class ExamNotificationRequestComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  queries;
  title;
  editTitle;
  selectedTag;
  description;
  editdescription;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;

  fetchDetails(id) {
    this.networkRequest.getWithHeaders(`/api/filtertag/${id}/`)
    .subscribe(
      data => {
        console.log("tag details ", data);
        this.selectedTag = data;
        this.editTitle = this.selectedTag['title'];
        this.editdescription = this.selectedTag['description']
      },
      error => {
      });
  }

  getQueries() {
    this.networkRequest.getWithHeaders(`/api/examalertrequest/?page=${this.currentPage}`)
      .subscribe(
        data => {
          console.log("requests ", data);
          this.queries = data['results'];
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
      );
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getQueries();
  }

  ngOnInit(): void {
    this.goToPage(1);
  }


}
