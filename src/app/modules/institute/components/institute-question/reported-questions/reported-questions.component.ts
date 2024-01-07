import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-reported-questions',
  templateUrl: './reported-questions.component.html',
  styleUrls: ['./reported-questions.component.scss']
})
export class ReportedQuestionsComponent implements OnInit {

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
  selectedQueryId;
  reply;

  selectQuery(id) {
    this.selectedQueryId = id;
    this.reply = null;
  }

  updateRemarks() {
    const formData = {
      id: this.selectedQueryId,
      reply: this.reply
    }
    this.networkRequest.putWithHeaders(formData,`/api/userreportedquestionreply/`)
      .subscribe(
        data => {
          console.log("remarks updated ", data);
          this.closeModal.nativeElement.click();
          this.selectedQueryId = null;
          this.reply = null;
          this.toastr.success('Remarks updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
          this.getQueries();
        },
        error => {
        });
  }

  getQueries() {
    this.networkRequest.getWithHeaders(`/api/reported_questions/?page=${this.currentPage}`)
      .subscribe(
        data => {
          console.log("queries ", data);
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
